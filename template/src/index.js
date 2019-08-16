/**
 * @module input/bibjson
 */

import { plugins } from '@citation-js/core'
import input from './input'
import output from './output'
import config from './config'

const ref = '@$SCOPE'
plugins.add(ref, { input, output, config })
