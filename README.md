# plugin-template
Template for Citation.js plugins

## Usage

### Initiating the template

```bash
mkdir your-plugin
cd your-plugin

npm init @citation-js/plugin
# or 'npx @citation-js/create-plugin'
```

This triggers a few questions:

  - **package name:** The name of the package as you want to publish it on npm
  - **version:** The current version. I recommend `0.0.0`, then you can run `npm version major`, `minor` or `patch` when the first version is ready
  - **description:** Something like "Citation.js plugin for ..."
  - **entry point:** You can leave this empty, unless you have some specific ideas. It gets filled in later with a more specific default
  - **test command:** You can leave this empty as well
  - **git repository:** If you are putting this in a Git repository, you can put the URL here
  - **keywords:** Comma-separated list of keywords, if you want to you can include `citation-js` and the format the plugin is for
  - **author:** Your name, optionally followed by `<email>` and/or `(website)`
  - **license:** Most current plugins are MIT-licensed, but that's your decision
  - **Is this OK?:** Yes, unless you made a mistake of course
  - **What should the plugin scope name (csl, doi, bibtex) be?** Up to you, but try to keep it simple, like `pubmed` for PubMed and PubMed Central Identifiers

This generates a file structure:

    .
    ├── .gitignore
    ├── .travis.yml         # Configuration for my CI of choice, Travis CI
    ├── babel.config.js     # Configuration for the Babel build tool
    ├── package.json        # package manifest for npm/Node
    ├── README.md
    ├── src
    │   ├── config.js       # Defines default config options
    │   ├── index.js        # Registers the plugin
    │   ├── input.js        # Defines input formats
    │   └── output.js       # Defines output formats
    └── test
        └── suite.js        # test suite

Now, run:

```bash
npm install
```

This installs the necessary development tools.

### Editing source files

  - If your plugin only defines input or output formats, you can remove the other file and references to that file from `index.js`.
  - If you do not need configuration, you can remove the file and remove references to the file from `index.js` and `input.js`.
  - `input.js` contains an example format with an identifier that gets parsed into an API URL, the result of which
  - More documentation and links can be found in comments in the source files.
  - The code style is [StandardJS](https://standardjs.com). Linting can be done with `npm run lint` and simple style issues can be corrected with `npm run lint -- --fix`

### Testing

  - An easy way to test while developing is with the following code:
  ```js
  const core = require('@citation-js/core') // Get Citation.js
  require('@babel/register')                // Make sure you can use modern features
  require('./src/')                         // Load the plugin you are working on

  // If you are using synchronous functions
  const data = core.Cite(input, options)
  // ...

  // If you are using asynchronous functions
  core.Cite.async(input, options)
      .then(data => /* ... */)
      .catch(console.error)
  ```
  - To write proper tests, see `test/suite.js`, which includes comments
