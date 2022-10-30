// file deepcode ignore WrongNumberOfArguments: auto binded

export default async function (logger, db, sql) {
  return {
    getTables: () => getTables(db, sql)
  }
}

async function getTables (db, sql) {
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
