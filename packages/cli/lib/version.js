const { resolve, join } = require('path')
const { readFileSync } = require('fs')

const root = resolve(__dirname, '..')
const { version } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))

module.exports = version
