'use strict'

const { removeNulls } = require('@mateonunez/asterism-huston')
const { default: lyraSchemaResolver } = require('@mateonunez/lyra-schema-resolver')
const { create, insert } = require('@lyrasearch/lyra')

function generateSchema (logger, data) {
  if (logger) logger.info('Generating schema.')

  const schema = {}
  data = removeNulls(data)
  for (const entry in data) {
    if (data[entry]?.length === 0 || !data[entry]) {
      logger.warn(`The table "${entry}" is empty. Skipping.`)
      continue
    }

    schema[entry] = lyraSchemaResolver(data[entry])
  }
  return schema
}

function generateAsterism (logger, data, schema) {
  logger.info('Generating asterism.')

  const asterism = {}
  for (const key of Object.keys(schema)) {
    const lyra = create({ schema: schema[key] })
    asterism[key] = lyra

    for (const entry of data[key]) {
      insert(lyra, entry)
    }
  }

  return asterism
}

module.exports = {
  generateSchema,
  generateAsterism
}
