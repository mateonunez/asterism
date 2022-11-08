import common from './common.js'

export default async function (logger, db, sql) {
  return {
    ...(await common(logger, db, sql)),
    getTables: () => getTables(logger, db, sql)
  }
}

async function getTables (logger, db, sql) {
  // Get tables on Postgres
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
