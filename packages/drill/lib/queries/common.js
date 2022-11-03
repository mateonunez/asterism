// file deepcode ignore WrongNumberOfArguments: auto binded

export default async function (logger, db, sql) {
  return {
    getTables: () => getTables(db, sql),
    getTable: (tableName) => getTable(db, sql, tableName),
    selectData: (tableName, columns, where) => selectData(logger, db, sql, tableName, columns, where)
  }
}

async function getTables (db, sql) {
  const response = await db.query(sql`
    SELECT TABLE_NAME
    FROM information_schema.tables
    WHERE table_schema = (SELECT DATABASE())
  `)

  if (response.length === 0) {
    throw new Error('There are no tables.')
  }

  const tables = []
  for (const { TABLE_NAME } of response) {
    tables.push(TABLE_NAME)
  }
  return tables
}

async function getTable (db, sql, tableName) {
  const response = await db.query(sql`
    SELECT TABLE_NAME
    FROM information_schema.tables
    WHERE table_schema = (SELECT DATABASE())
    AND TABLE_NAME = ${sql.ident(tableName)}
  `)

  if (response.length === 0) {
    throw new Error(`The table "${tableName}" does not exist.`)
  }

  const { TABLE_NAME: table } = response[0]
  return table
}

async function selectData (logger, db, sql, tableName /** columns, where */) {
  const response = await db.query(sql`
    SELECT *
    FROM ${sql.ident(tableName)}
  `)

  if (response.length === 0) {
    logger.warn(`The table "${tableName}" is empty.`)
  }

  return response
}
