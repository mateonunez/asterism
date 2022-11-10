import common from './common.js'

export default async function (logger, db, sql) {
  return {
    ...(await common(logger, db, sql)),
    getTables: () => getTables(logger, db, sql),
    getTable: (tableName) => getTable(logger, db, sql, tableName)
  }
}

async function getTables (logger, db, sql) {
  if (logger) logger.info('Getting tables.')
  const response = await db.query(sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
  `)
  if (response.length === 0) {
    if (logger) logger.warn('No tables found.')
  }
  const tables = []
  for (const { table_name: tableName } of response) {
    tables.push(tableName)
  }
  return tables
}

async function getTable (logger, db, sql, tableName) {
  if (logger) logger.info(`Getting table: ${tableName}.`)
  const response = await db.query(sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
    AND table_name = ${tableName}
  `)
  if (response.length === 0) {
    if (logger) logger.warn(`Table "${tableName}" does not exist.`)
  }
  const tables = []
  for (const { table_name: tableName } of response) {
    tables.push(tableName)
  }
  return tables
}
