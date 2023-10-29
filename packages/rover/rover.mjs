'use strict'

import fs from 'node:fs'
import path from 'node:path'
import { normalizers } from '@mateonunez/asterism-huston'
import { create, insert, search } from '@orama/orama'
import { persistToFile, restoreFromFile } from '@orama/plugin-data-persistence/server'
import oramaSchemaResolver from 'orama-schema-resolver'
import createOramaCache from 'orama-cache'

const { removeNulls } = normalizers
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

    schema[entry] = oramaSchemaResolver(data[entry], options)
  }
  return schema
}

async function generateAsterism (logger, data, schema, options) {
  if (logger) logger.info('Generating asterism.')

  /* c8 ignore next */
  const strict = options?.strict ?? true

  const asterism = {}
  for (const key of Object.keys(schema)) {
    const orama = await create({ schema: schema[key] })
    asterism[key] = orama

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

      await insert(orama, document)
    }
  }

  return asterism
}

async function populateAsterism (logger, asterism, options) {
  if (logger) logger.info('Populating asterism.')
  const filePath = path.resolve(join(process.cwd(), options.outputDir))
  /* c8 ignore next */
  if (!fs.existsSync(filePath)) fs.mkdirSync(filePath, { recursive: true })

  for (const key of Object.keys(asterism)) {
    if (logger) logger.info(`Persisting "${key}.json" to disk: ${filePath}`)
    await persistToFile(asterism[key], 'json', `${filePath}/${key}.json`)
  }
}

async function resolveAsterism (logger, options) {
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
      const orama = await restoreFromFile('json', `${filePath}/${file}`)
      asterism[file.replace(/\.js$/, '')] = orama
    }
  }
  return asterism
}

const caches = {}

async function searchOnAsterism (logger, asterism, term, options) {
  if (logger) logger.info('Searching on asterism.')

  const cacheDisabled = options?.cacheDisabled ?? false
  const results = {}

  for (const key of Object.keys(asterism)) {
    if (!cacheDisabled) {
      if (!caches[key]) {
        caches[key] = createOramaCache(asterism[key])
      }

      results[key] = await caches[key].search({ term })
      results[key] = { ...results[key], cached: true }
    } else {
      results[key] = await search(asterism[key], { term })
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

export {
  generateSchema,
  generateAsterism,
  populateAsterism,
  resolveAsterism,
  searchOnAsterism,
  saveSearchResults
}
