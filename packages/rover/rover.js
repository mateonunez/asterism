'use strict'

const { removeNulls } = require('@mateonunez/asterism-huston')
const { default: lyraSchemaResolver } = require('@mateonunez/lyra-schema-resolver')
const { create, insert } = require('@lyrasearch/lyra')
const { persistToFile } = require('@lyrasearch/plugin-data-persistence')
const fs = require('fs')
const path = require('path')
const { join } = path

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
  if (logger) logger.info('Generating asterism.')

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

function populateAsterism (logger, asterism, options) {
  if (logger) logger.info('Populating asterism.')
  const filePath = path.resolve(join(process.cwd(), options.outputDir))
  /* c8 ignore next */
  if (!fs.existsSync(filePath)) fs.mkdirSync(filePath, { recursive: true })

  for (const key of Object.keys(asterism)) {
    if (logger) logger.info(`Persisting "${key}.json" to disk: ${filePath}`)
    persistToFile(asterism[key], 'json', `${filePath}/${key}.json`)
  }
}

module.exports = {
  generateSchema,
  generateAsterism,
  populateAsterism
}
