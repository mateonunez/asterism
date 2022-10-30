import pino from 'pino'
import pretty from 'pino-pretty'
import setupDatabase, { killDatabase, resolveTables, resolveData } from '@asterism/drill'
import { allowedDatabases } from '@asterism/drill/lib/database.js'
import validateOptions from '@asterism/drill/lib/validate-options.js'
import { generateSchema, generateAsterism } from '@asterism/rover'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const logger = pino(
  pretty({
    translateTime: 'yyyy-mm-dd HH:MM:ss.l',
    ignore: 'pid,hostname'
  })
)

export default async function (database, options) {
  if (!database) {
    logger.warn(`The argument "${database}" is not valid. Defaulting to 'mysql'. Allowed values are ${allowedDatabases.join(', ')}.`)
    database = 'mysql'
  }

  validateOptions(logger, options)

  const { db, queryer } = await setupDatabase(logger, database, options)
  const tables = await resolveTables(logger, queryer, options)
  const data = await resolveData(logger, queryer, tables, options)

  await killDatabase(db)

  const schema = generateSchema(logger, data)
  const asterism = generateAsterism(logger, data, schema)

  await sleep(100)

  return { db, asterism }
}
