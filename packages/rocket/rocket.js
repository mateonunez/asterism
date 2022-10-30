import pino from 'pino'
import pretty from 'pino-pretty'
import setupDatabase, { resolveTables } from '@asterism/drill'
import { allowedDatabases } from '@asterism/drill/lib/database.js'
import validateOptions from '@asterism/drill/lib/validate-options.js'

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

  // is this really necessary?
  validateOptions(logger, options)

  const { db, sql, queryer } = await setupDatabase(logger, database, options)
  const tables = await resolveTables(logger, db, sql, queryer)
  console.log(tables)

  return { db, sql }
}
