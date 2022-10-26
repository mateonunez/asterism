export default function validateOptions (logger, options) {
  const { host, port, databaseName, user, password, output } = options

  if (!host) {
    logger.error('Host is required')
    process.exit(1)
  }

  if (!port) {
    logger.error('Port is required')
    process.exit(1)
  }

  if (!databaseName) {
    logger.error('Database name is required')
    process.exit(1)
  }

  if (!user) {
    logger.error('User is required')
    process.exit(1)
  }

  if (!password) {
    logger.error('Password is required')
    process.exit(1)
  }

  if (!output) {
    logger.error('Output is required')
    process.exit(1)
  }
}
