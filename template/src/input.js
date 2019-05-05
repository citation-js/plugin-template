import { utils } from '@citation-js/core'
import config from './config'

export const ref = '@$SCOPE'
export const formats = {
  // fetch from API
  '@$SCOPE/id': {
    parseAsync (id) {
      const url = `https://example.com/api/${id}`
      const headers = {}

      if (config.apiToken) {
        headers.Authorization = `token ${config.apiToken}`
      }

      return utils.fetchFileAsync(url, { headers })
    },
    parseType: {
      dataType: 'String',
      predicate: /^Q\d+$/
    }
  },

  // translate to CSL-JSON
  '@$SCOPE/record': {
    parse (record) {

    },
    parseType: {
      dataType: 'SimpleObject',
      propertyConstraint: {
        props: 'source',
        value: 'https://example.com'
      }
    }
  }
}

export { ref, formats }
