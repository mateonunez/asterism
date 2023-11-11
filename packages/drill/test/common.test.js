import { test } from 'node:test'
import { tspl } from '@matteo.collina/tspl'
import setupDatabase, { killDatabase } from './../drill.js'
import symbols from '../lib/symbols.js'
import huston from '@mateonunez/asterism-huston'

const { logger, mysqlOptions, postgresOptions } = huston
const { privateMethods } = symbols

async function createTable (queryer, tableName) {
  await queryer[privateMethods].createTable(tableName, {
    id: {
      type: 'int',
      primaryKey: true
    },
    name: {
      type: 'varchar',
      length: 255
    }
  }, { dropIfExists: true })
}

async function insertIntoTable (queryer, tableName) {
  await queryer[privateMethods].insertData(tableName, {
    id: 1,
    name: 'test'
  })
}

const supportedDatabases = [
  { name: 'mysql', options: mysqlOptions },
  { name: 'postgres', options: postgresOptions }
]

test('should drop a database', async (t) => {
  const { ok } = tspl(t, { plan: 2 })

  for (const database of supportedDatabases) {
    await t.test(database.name, async () => {
      const { db, queryer } = await setupDatabase(logger, database.name, database.options)
      const databaseName = 'test'
      await queryer[privateMethods].createDatabase(databaseName, { dropIfExists: true })

      await queryer[privateMethods].dropDatabase(databaseName)
      await killDatabase(db)
      ok(db._disposed)
    })
  }
})

test('should create a new table', async (t) => {
  const { ok } = tspl(t, { plan: 2 })

  for (const database of supportedDatabases) {
    await t.test(database.name, async () => {
      const { db, queryer } = await setupDatabase(logger, database.name, database.options)
      const tableName = 'common_table_test'
      await createTable(queryer, tableName)
      await queryer[privateMethods].dropTable(tableName)
      await killDatabase(db)

      ok(db)
    })
  }
})

test('should insert data into a table', async (t) => {
  const { ok, deepStrictEqual } = tspl(t, { plan: 4 })

  for (const database of supportedDatabases) {
    await t.test(database.name, async () => {
      const { db, queryer } = await setupDatabase(logger, database.name, database.options)
      const tableName = 'common_table_test'
      await createTable(queryer, tableName)
      await insertIntoTable(queryer, tableName)
      const data = await queryer.selectData(tableName)

      deepStrictEqual(data, [{ id: 1, name: 'test' }])

      await queryer[privateMethods].dropTable(tableName)
      await killDatabase(db)

      ok(db)
    })
  }
})

test('should select data from a table', async (t) => {
  const { ok, deepStrictEqual } = tspl(t, { plan: 4 })

  for (const database of supportedDatabases) {
    await t.test(database.name, async () => {
      const { db, queryer } = await setupDatabase(logger, database.name, database.options)
      const tableName = 'common_table_test'
      await createTable(queryer, tableName)
      await insertIntoTable(queryer, tableName)
      const data = await queryer.selectData(tableName)

      deepStrictEqual(data, [{ id: 1, name: 'test' }])

      await queryer[privateMethods].dropTable(tableName)
      await killDatabase(db)

      ok(db)
    })
  }
})

test('should delete data from a table', async (t) => {
  const { ok, deepStrictEqual } = tspl(t, { plan: 4 })

  for (const database of supportedDatabases) {
    await t.test(database.name, async () => {
      const { db, queryer } = await setupDatabase(logger, database.name, database.options)
      const tableName = 'common_table_test'
      await createTable(queryer, tableName)
      await insertIntoTable(queryer, tableName)
      await queryer[privateMethods].deleteData(tableName, { id: 1 })
      const data = await queryer.selectData(tableName)

      deepStrictEqual(data, [])

      await queryer[privateMethods].dropTable(tableName)
      await killDatabase(db)

      ok(db)
    })
  }
})

test('should update data from a table', async (t) => {
  const { ok, deepStrictEqual } = tspl(t, { plan: 4 })

  for (const database of supportedDatabases) {
    await t.test(database.name, async () => {
      const { db, queryer } = await setupDatabase(logger, database.name, database.options)
      const tableName = 'common_table_test'
      await createTable(queryer, tableName)
      await insertIntoTable(queryer, tableName)
      await queryer[privateMethods].updateData(tableName, { name: 'test2' }, { id: 1 })
      const data = await queryer.selectData(tableName)

      deepStrictEqual(data, [{ id: 1, name: 'test2' }])

      await queryer[privateMethods].dropTable(tableName)
      await killDatabase(db)

      ok(db)
    })
  }
})
