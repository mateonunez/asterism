const { resolve, join } = require('path')

const root = resolve(__dirname, '../')
const cliPath = join(root, 'cli.mjs')

module.exports = cliPath
