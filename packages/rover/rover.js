'use strict'

const { removeNulls } = require('@asterism/huston')
const { default: lyraSchemaResolver } = require('@mateonunez/lyra-schema-resolver')

function resolveSchema (logger, data, entity) {
  if (data?.length === 0) {
    logger.warn(`The table "${entity}" is empty. Skipping.`)
    return
  }

  logger.info(`Generating schema for ${entity}`)

  data = removeNulls(data)

  let schema
  try {
    schema = lyraSchemaResolver(data)
  } catch (err) {
    if (logger) logger.error(`Error generating schema for ${entity}: ${err.message}`)
    throw err
  }
  return schema
}

module.exports = {
  resolveSchema
}
