'use strict'

const { removeNulls } = require('@mateonunez/asterism-huston')
const { default: lyraSchemaResolver } = require('@mateonunez/lyra-schema-resolver')
const { create, insert, search: searchLyra } = require('@lyrasearch/lyra')
const { searchCache } = require('@mateonunez/lyra-cache')
const { persistToFile, restoreFromFile } = require('@lyrasearch/plugin-data-persistence')
const fs = require('fs')
const path = require('path')
const { join } = path

// eslint-disable-next-line no-extend-native
BigInt.prototype.toJSON = function () { return this.toString() }

function generateSchema (logger, data, options) {
  if (logger) logger.info('Generating schema.')

  const schema = {}
  data = removeNulls(data)
  for (const entry in data) {
    if (data[entry]?.length === 0 || !data[entry]) {
      logger.warn(`The table "${entry}" is empty. Skipping.`)
      continue
    }

    schema[entry] = lyraSchemaResolver(data[entry], options)
  }
  return schema
}

function generateAsterism (logger, data, schema, options) {
  if (logger) logger.info('Generating asterism.')

  /* c8 ignore next */
  const strict = options?.strict ?? true

  const asterism = {}
  for (const key of Object.keys(schema)) {
    const lyra = create({ schema: schema[key] })
    asterism[key] = lyra

    for (const entry of data[key]) {
      const document = entry

      /* c8 ignore next 9 */
      if (!strict) {
        for (const field of Object.keys(entry)) {
          if (typeof entry[field] === 'object') {
            document[field] = JSON.stringify(entry[field])
          } else {
            document[field] = String(entry[field])
          }
        }
      }

      insert(lyra, document)
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

function resolveAsterism (logger, options) {
  if (logger) logger.info('Resolving asterism.')
  const filePath = path.resolve(join(process.cwd(), options.inputDir))
  /* c8 ignore next 4 */
  if (!fs.existsSync(filePath)) {
    logger.warn(`The directory "${filePath}" does not exist. Please run "falcon migrate" first.`)
    return
  }
  const asterism = {}
  for (const file of fs.readdirSync(filePath)) {
    if (file.endsWith('.json')) {
      const lyra = restoreFromFile('json', `${filePath}/${file}`)
      asterism[file.replace('.json', '')] = lyra
    }
  }
  return asterism
}

async function searchOnAsterism (logger, asterism, term, options) {
  if (logger) logger.info('Searching on asterism.')

  const cacheEnabled = options?.cacheEnabled || false
  const search = cacheEnabled ? searchCache : searchLyra
  const results = {}
  for (const key of Object.keys(asterism)) {
    if (cacheEnabled) {
      results[key] = await search({ db: asterism[key], term })
      results[key] = { ...results[key], cached: true }
    } else {
      results[key] = search(asterism[key], { term })
    }
  }

  if (options?.outputDir) {
    saveSearchResults(logger, results, options)
  }

  return results
}

function saveSearchResults (logger, results, options) {
  if (logger) logger.info('Saving search results.')

  /* c8 ignore next 4 */
  if (!options.outputDir) {
    logger.error('You must provide a valid path')
    return
  }

  const filePath = path.resolve(join(process.cwd(), options.outputDir))
  /* c8 ignore next */
  if (!fs.existsSync(filePath)) fs.mkdirSync(filePath, { recursive: true })

  const filename = `${filePath}/search-results-${Date.now()}.json`
  const stringified = JSON.stringify(results, null, 2)
  fs.writeFileSync(filename, stringified)

  if (logger) logger.info(`Search results saved to ${filename}`)

  return filename
}

module.exports = {
  generateSchema,
  generateAsterism,
  populateAsterism,
  resolveAsterism,
  searchOnAsterism
}
