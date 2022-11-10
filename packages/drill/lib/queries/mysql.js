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
    SELECT TABLE_NAME
    FROM information_schema.tables
    WHERE table_schema = (SELECT DATABASE())
  `)

  const tables = []
  for (const { TABLE_NAME } of response) {
    tables.push(TABLE_NAME)
  }
  return tables
}

async function getTable (logger, db, sql, tableName) {
  const response = await db.query(sql`
    SELECT TABLE_NAME
    FROM information_schema.tables
    WHERE table_schema = (SELECT DATABASE())
    AND TABLE_NAME = ${tableName}
  `)

  if (response.length === 0) {
    if (logger) logger.warn(`Table "${tableName}" does not exist.`)
    return null
  }
  const { TABLE_NAME: table } = response[0]
  return table
}
