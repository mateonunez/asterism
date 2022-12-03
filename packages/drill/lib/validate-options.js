export default function validateOptions (logger, database, options) {
  if (logger) logger.info('Validating options...')

  let validatedOptions = {}
  switch (database) {
    case 'mysql':
      validatedOptions = validateMysqlOptions(options)
      break
    case 'postgres':
      validatedOptions = validatePostgresOptions(options)
      break
    default:
      throw new Error(`The database "${database}" is not supported.`)
  }

  if (!options.host) validatedOptions.host = '127.0.0.1'
  if (!options.outputDir) validatedOptions.outputDir = './out'
  if (!options.inputDir) validatedOptions.inputDir = './lyra'

  return validatedOptions
}

function validateMysqlOptions (options) {
  if (!options.port) options.port = 3306
  if (!options.user) options.user = 'root'
  if (!options.password) options.password = 'toor'
  return options
}

function validatePostgresOptions (options) {
  if (!options.port) options.port = 5432
  if (!options.user) options.user = 'postgres'
  if (!options.password) options.password = 'postgres'
  return options
}
