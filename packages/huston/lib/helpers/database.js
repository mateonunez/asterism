'use strict'

const mysqlOptions = {
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  // deepcode ignore NoHardcodedPasswords/test: example data
  password: 'toor',
  outputDir: './out',
  inputDir: './lyra'
}

const postgresOptions = {
  ...mysqlOptions,
  user: 'postgres',
  port: '5432'
}

module.exports = { mysqlOptions, postgresOptions }
