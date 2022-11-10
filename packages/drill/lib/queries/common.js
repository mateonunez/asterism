// file deepcode ignore WrongNumberOfArguments: auto binded

import symbols from '../../lib/symbols.js'

export default async function (logger, db, sql) {
  return {
    selectData: (tableName, columns, where) => selectData(logger, db, sql, tableName, columns, where),
    [symbols.privateMethods]: {
      createDatabase: (database, options) => createDatabase(logger, db, sql, database, options),
      dropDatabase: (database, options) => dropDatabase(logger, db, sql, database),
      createTable: (table, columns, options) => createTable(logger, db, sql, table, columns, options),
      dropTable: (tableName, options) => dropTable(logger, db, sql, tableName),
      insertData: (tableName, data, options) => insertData(logger, db, sql, tableName, data),
      deleteData: (tableName, where, options) => deleteData(logger, db, sql, tableName, where),
      updateData: (tableName, data, where, options) => updateData(logger, db, sql, tableName, data, where)
    }
  }
}

async function selectData (logger, db, sql, tableName, columns = '*', where = {}) {
  if (logger) logger.info(`Selecting data from "${tableName}".`)
  const columnDefinitions = []
  const values = []
  if (columns === '*') {
    columnDefinitions.push(sql`*`)
  } else {
    /* c8 ignore next 5 */
    for (const [name, value] of Object.entries(columns)) {
      columnDefinitions.push(sql`${sql.ident(name)} = ${sql.value(value)}`)
      values.push(value)
    }
  }
  /* c8 ignore next 5 */
  const conditions = []
  for (const [name, value] of Object.entries(where)) {
    conditions.push(sql`${sql.ident(name)} = ${sql.value(value)}`)
    values.push(value)
  }
  const response = await db.query(sql`
    SELECT ${sql.join(columnDefinitions, sql`, `)}
    FROM ${sql.ident(tableName)}
    ${conditions.length > 0 ? sql`WHERE ${sql.join(conditions, sql` AND `)}` : sql``}
  `)

  return response
}

async function createDatabase (logger, db, sql, database, options) {
  if (logger) logger.info(`Creating database "${database}".`)
  if (options?.dropIfExists) await dropDatabase(logger, db, sql, database)
  await db.query(sql`CREATE DATABASE ${sql.ident(database)} `)
}

async function dropDatabase (logger, db, sql, database) {
  if (logger) logger.info(`Dropping database "${database}".`)
  await db.query(sql`DROP DATABASE IF EXISTS ${sql.ident(database)}`)
}

async function createTable (logger, db, sql, table, columns, options) {
  if (logger) logger.info(`Creating table "${table}".`)
  const columnDefinitions = []
  for (const [name, definition] of Object.entries(columns)) {
    const dangerousRaw = sql.__dangerous__rawValue(`${definition.type + (definition.length ? `(${definition.length})` : '')} ${definition.autoIncrement ? 'AUTO_INCREMENT' : ''} ${definition.primaryKey ? 'PRIMARY KEY' : ''}`)
    const row = sql`${sql.ident(name)} ${dangerousRaw}`
    columnDefinitions.push(row)
  }
  /* c8 ignore next 1 */
  if (options?.dropIfExists) await dropTable(logger, db, sql, table)

  await db.query(sql`
    CREATE TABLE ${sql.ident(table)} (
      ${sql.join(columnDefinitions, sql`, `)})
    `)
}

async function dropTable (logger, db, sql, tableName) {
  if (logger) logger.info(`Dropping table "${tableName}".`)
  await db.query(sql`DROP TABLE IF EXISTS ${sql.ident(tableName)}`)
}

async function insertData (logger, db, sql, tableName, data) {
  if (logger) logger.info(`Inserting data into "${tableName}".`)
  const columnNames = []
  const values = []
  for (const [name, value] of Object.entries(data)) {
    columnNames.push(sql.ident(name))
    values.push(sql.value(value))
  }
  await db.query(sql`
    INSERT INTO ${sql.ident(tableName)}
    (${sql.join(columnNames, sql`, `)})
    VALUES (${sql.join(values, sql`, `)})
  `)
}

async function deleteData (logger, db, sql, tableName, where) {
  if (logger) logger.info(`Deleting data from "${tableName}".`)
  const conditions = []
  const values = []
  for (const [name, value] of Object.entries(where)) {
    conditions.push(sql`${sql.ident(name)} = ${value}`)
    values.push(value)
  }
  await db.query(sql`
    DELETE FROM ${sql.ident(tableName)}
    WHERE ${sql.join(conditions, sql` AND `)}
  `)
}

async function updateData (logger, db, sql, tableName, data, where) {
  if (logger) logger.info(`Updating data in "${tableName}".`)
  const columnDefinitions = []
  const values = []
  for (const [name, value] of Object.entries(data)) {
    columnDefinitions.push(sql`${sql.ident(name)} = ${value}`)
    values.push(value)
  }
  const conditions = []
  for (const [name, value] of Object.entries(where)) {
    conditions.push(sql`${sql.ident(name)} = ${value}`)
    values.push(value)
  }
  await db.query(sql`
    UPDATE ${sql.ident(tableName)}
    SET ${sql.join(columnDefinitions, sql`, `)}
    WHERE ${sql.join(conditions, sql` AND `)}
  `)
}
