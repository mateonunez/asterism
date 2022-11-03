import common from './common.js'

export default async function (logger, db, sql) {
  return {
    ...common, // getTables and getTable are not in common
    getTables: () => getTables(logger, db, sql),
    getTable: (tableName) => getTable(logger, db, sql, tableName)
  }
}

async function getTables (logger, db, sql) {
  const response = await db.all(sql`SELECT name FROM sqlite_master WHERE type = 'table'`)
  return response.map(({ name }) => name)
}

async function getTable (logger, db, sql, tableName) {
  const response = await db.all(sql`SELECT name FROM sqlite_master where type ='table' and name = ${sql.indent(tableName)}`)

  if (response.length === 0) {
    throw new Error(`The table "${tableName}" does not exist.`)
  }

  const { name: table } = response[0]
  return table
}
