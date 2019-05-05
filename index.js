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
      node: '>=8'
    },
    files: [
      '/lib'
    ],
    nyc: {
      include: [
        'src/**/*.js'
      ],
      sourceMap: false,
      instrument: false
    },
    standard: {
      parser: 'babel-eslint'
    },
    scripts: {
      test: 'mocha -r @babel/register -R spec test/suite.js',
      babel: 'babel src -d lib --copy-files',
      lint: 'standard "src/**/*.js" "test/**/*.js"',
      coverage: 'nyc npm test',
      report: 'nyc report --reporter=lcov > coverage.lcov',
      prepublishOnly: 'npm run babel',
      preversion: 'npm run lint && npm run test'
    },
    dependencies: {},
    devDependencies: {
      '@babel/cli': '^7.2.3',
      '@babel/core': '^7.2.2',
      '@babel/preset-env': '^7.2.3',
      '@babel/register': '^7.0.0',
      'babel-eslint': '^10.0.1',
      'babel-plugin-istanbul': '^5.1.0',
      mocha: '^5.2.0',
      nyc: '^13.1.0',
      standard: '^12.0.1'
    }
  })

  fs.writeFileSync('package.json', JSON.stringify(package, null, 2))

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
