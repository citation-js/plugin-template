#!/usr/bin/env node

const init = require('init-package-json')
const fs = require('fs')
const readline = require('readline')
const path = require('path')

const initFile = path.resolve(process.env.HOME, '.npm-init')
const cwd = process.cwd()
let package
let rl

console.log(`This tool will walk you through creating a plugin for Citation.js.
You can leave defaults for 'main' and 'test', those will be filled
in later.
`)

init(cwd, initFile, (er, data) => {
  if (er) {
    console.log()
    process.exit(0)
  }

  package = data

  package.main = package.main === 'index.js' ? 'lib/index.js' : package.main

  Object.assign(package, {
    engines: {
      node: '>=14'
    },
    files: [
      '/lib'
    ],
    standard: {
      parser: '@babel/eslint-parser'
    },
    scripts: {
      test: 'mocha -r @babel/register test/suite.js',
      babel: 'babel src -d lib --copy-files',
      lint: 'standard "src/**/*.js" "test/**/*.js"',
      changelog: 'conventional-changelog -p angular -i CHANGELOG.md -s -r 0 && git add CHANGELOG.md',
      coverage: 'NODE_ENV=coverage nyc npm test',
      report: 'nyc report --reporter=lcov > coverage.lcov',
      preversion: 'npm run lint && npm run test',
      version: 'npm run changelog',
      postversion: 'npm run babel'
    },
    dependencies: {
      '@citation-js/date': '^0.5.0',
      '@citation-js/name': '^0.4.2',
    },
    devDependencies: {
      '@babel/cli': '^7.12.10',
      '@babel/core': '^7.12.10',
      '@babel/eslint-parser': '^7.14.3',
      '@babel/preset-env': '^7.12.10',
      '@babel/register': '^7.12.10',
      'babel-plugin-istanbul': '^5.1.0',
      '@citation-js/core': '^0.5.1',
      'conventional-changelog-cli': '^2.1.0',
      mocha: '^8.4.0',
      nyc: '^15.1.0',
      standard: '^16.0.3'
    },
    peerDependencies: {
      '@citation-js/core': '^0.5.1'
    }
  })

  fs.writeFileSync('package.json', JSON.stringify(package, null, 2))
  fs.writeFileSync('.gitignore', `/lib
/node_modules
/package-lock.json`)

  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.question('What should the plugin scope name (csl, doi, bibtex) be? ', copyTemplate)
})

function copyTemplate (scope) {
  const input = {
    $PACKAGE: package.name,
    $SCOPE: scope
  }

  rl.close()

  const template = path.join(__dirname, 'template')

  function copy (dir) {
    const source = path.join(template, dir)
    const files = fs.readdirSync(source)

    try {
      fs.mkdirSync(dir)
    } catch (e) {
      if (e.code === 'EEXIST') {
        // expected for dir === '.'
      } else {
        throw e
      }
    }

    for (let file of files) {
      const target = path.join(dir, file)
      try {
        let text = fs.readFileSync(path.join(source, file), 'utf8')
        text = text.replace(/\$\w+/g, (variable) => input[variable])
        fs.writeFileSync(target, text)
      } catch (e) {
        if (e.code === 'EISDIR') {
          copy(target)
        } else {
          throw e
        }
      }
    }
  }

  copy('.')
}
