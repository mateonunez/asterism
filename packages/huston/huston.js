'use strict'

const time = require('./lib/time.js')
const normalizers = require('./lib/normalizers.js')

module.exports = {
  ...time,
  ...normalizers
}
