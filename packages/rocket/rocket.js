import pino from 'pino'
import pretty from 'pino-pretty'
import setupDatabase, { killDatabase } from '@asterism/drill'
import { allowedDatabases } from '@asterism/drill/lib/database.js'
import validateOptions from '@asterism/drill/lib/validate-options.js'
import { resolveSchema } from '@asterism/rover'

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

  let tables
  if (!options.tableName) {
    tables = await queryer.getTables()
  } else {
    tables = [await queryer.getTable(options.tableName)]
  }

  const data = {}
  for (const table of tables) {
    data[table] = await queryer.selectData(table)
  }

  await killDatabase(db)

  const schema = {}
  for (const entity in data) {
    schema[entity] = resolveSchema(logger, data[entity], entity)
  }

  return { db, schema }
}
