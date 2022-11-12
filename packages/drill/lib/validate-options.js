export default function validateOptions (logger, options) {
  const { host, port, user, password, outputDir } = options

  if (!host) {
    logger.error('Host is required')
    process.exit(1)
  }

  if (!port) {
    logger.error('Port is required')
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

  if (!outputDir) {
    logger.error('Output dir is required')
    process.exit(1)
  }
}
