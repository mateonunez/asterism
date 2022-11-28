import pino from 'pino'
import pretty from 'pino-pretty'
import setupDatabase, { killDatabase, resolveTables, resolveData } from '@mateonunez/asterism-drill'
import { allowedDatabases } from '@mateonunez/asterism-drill/lib/database.js'
import validateOptions from '@mateonunez/asterism-drill/lib/validate-options.js'
import { generateSchema, generateAsterism, populateAsterism, resolveAsterism, searchOnAsterism } from '@mateonunez/asterism-rover'

const logger = pino(
  pretty({
    translateTime: 'yyyy-mm-dd HH:MM:ss.l',
    ignore: 'pid,hostname'
  })
)

export async function falconMigrate (database, options) {
  if (!database) {
    logger.warn(`The argument "${database}" is not valid. Defaulting to 'mysql'. Allowed values are ${allowedDatabases.join(', ')}.`)
    database = 'mysql'
  }

  const validatedOptions = validateOptions(logger, database, options)
  const { strict } = validatedOptions

  const { db, queryer } = await setupDatabase(logger, database, validatedOptions)
  const tables = await resolveTables(logger, queryer, validatedOptions)
  const data = await resolveData(logger, queryer, tables, validatedOptions)

  await killDatabase(db)

  const schema = generateSchema(logger, data, { strict })
  const asterism = generateAsterism(logger, data, schema, { strict })

  populateAsterism(logger, asterism, validatedOptions)

  logger.info('Done!')

  return { db, asterism }
}

export async function falconSearch (term, options) {
  if (!term) {
    logger.warn('The term cannot be empty. Please provide a term to search for.')
    return
  }

  const asterism = resolveAsterism(logger, options)
  const results = await searchOnAsterism(logger, asterism, term, options)

  logger.info(results)
  logger.info('Done!')
  return results
}
