const { resolve, join } = require('path')

const root = resolve(__dirname, '../')
const cliPath = join(root, 'index.mjs')

module.exports = cliPath
