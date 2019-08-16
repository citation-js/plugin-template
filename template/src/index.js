/**
 * @module input/bibjson
 */

import { plugins } from '@citation-js/core'

// Loads plugin definitions
import input from './input'
import output from './output'
import config from './config'

// Define plugin name (this is how it is referenced in the code)
const ref = '@$SCOPE'

// Registers the plugin
// docs: https://citation.js.org/api/tutorial-plugins.html
plugins.add(ref, { input, output, config })
