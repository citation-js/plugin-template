// Import utilities
// docs: https://citation.js.org/api/Cite.util.html
import { util } from '@citation-js/core'

// Import configuration
import config from './config'

// Input format definitions
//   - @$SCOPE/id: recognizes a specific kind of identifier and fetches related
//     info from an API (with an API token, if available)
//   - @$SCOPE/record: recognizes the response from the API and parses the results.
//     Note that this function does not have to parse JSON, that gets done
//     automatically by the @else/json format
//
// These two formats automatically create the input route
//   input -> @$SCOPE/id -> @else/json -> @$SCOPE/record -> @csl/object -> @csl/object+list -> result
//
// docs: https://citation.js.org/api/tutorial-input_plugins.html
export default {
  // fetch from API
  '@$SCOPE/id': {
    // parseAsync: asynchronous parsing function
    // docs: https://citation.js.org/api/tutorial-input_plugins.html#parseasync
    parseAsync (id) {
      const url = `https://example.com/api/${id}`
      const headers = {}

      if (config.apiToken) {
        headers.Authorization = `token ${config.apiToken}`
      }

      return util.fetchFileAsync(url, { headers })
    },

    // parseType: how the parser should recognize this specific format
    // docs: https://citation.js.org/api/tutorial-input_plugins.html#parsetype
    parseType: {
      // dataType: input should be a string
      // This can, in principle, be derived from the fact that predicate is a RegExp
      // docs: https://citation.js.org/api/tutorial-input_plugins.html#datatype
      dataType: 'String',

      // predicate: Function or RegExp testing whether the input is in fact @$SCOPE/id
      predicate: /^Q\d+$/
    }
  },

  // translate to CSL-JSON
  '@$SCOPE/record': {
    // parse: synchronous parsing function
    // docs: https://citation.js.org/api/tutorial-input_plugins.html#parse
    parse (record) {

    },

    // parseType: how the parser should recognize this specific format
    // docs: https://citation.js.org/api/tutorial-input_plugins.html#parsetype
    parseType: {
      // dataType: input should be an object (and not some fancy class instance, just a plain Object)
      // This can, in principle, be derived from the presence of propertyConstraint
      // docs: https://citation.js.org/api/tutorial-input_plugins.html#datatype
      dataType: 'SimpleObject',

      // propertyConstraint: this means the input object should have a property
      // named 'source' with a value of 'https://example.com'
      // docs: https://citation.js.org/api/tutorial-input_plugins.html#elementconstraint-propertyconstraint
      propertyConstraint: {
        props: 'source',
        value: 'https://example.com'
      }
    }
  }
}
