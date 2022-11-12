import { test } from 'tap'
import setupDatabase, { killDatabase } from './../drill.js'
import logger from './helpers/logger.js'
import symbols from '../lib/symbols.js'
import huston from '@asterism/huston'

const { mysqlOptions, postgresOptions } = huston
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

test('should drop a database', ({ end }) => {
  test('mysql', async ({ ok }) => {
    const { db, queryer } = await setupDatabase(logger, 'mysql', mysqlOptions)
    const databaseName = 'test'
    await queryer[privateMethods].createDatabase(databaseName, { dropIfExists: true })

    await queryer[privateMethods].dropDatabase(databaseName)
    await killDatabase(db)
    ok(db)
  })

  test('postgres', async ({ ok }) => {
    const { db, queryer } = await setupDatabase(logger, 'postgres', postgresOptions)
    const databaseName = 'test'
    await queryer[privateMethods].createDatabase(databaseName, { dropIfExists: true })

    await queryer[privateMethods].dropDatabase(databaseName)
    await killDatabase(db)
    ok(db)
  })

  end()
})

test('should create a new table', ({ end }) => {
  test('mysql', async ({ ok }) => {
    const { db, queryer } = await setupDatabase(logger, 'mysql', mysqlOptions)
    const tableName = 'common_table_test'
    await createTable(queryer, tableName)
    await queryer[privateMethods].dropTable(tableName)
    await killDatabase(db)

    ok(db)
  })

  test('postgres', async ({ ok }) => {
    const { db, queryer } = await setupDatabase(logger, 'postgres', postgresOptions)
    const tableName = 'common_table_test'
    await createTable(queryer, tableName)
    await queryer[privateMethods].dropTable(tableName)
    await killDatabase(db)

    ok(db)
  })

  end()
})

test('should insert data into a table', ({ end }) => {
  test('mysql', async ({ ok }) => {
    const { db, queryer } = await setupDatabase(logger, 'mysql', mysqlOptions)
    const tableName = 'common_table_test'
    await createTable(queryer, tableName)
    await insertIntoTable(queryer, tableName)
    await queryer[privateMethods].dropTable(tableName)
    await killDatabase(db)

    ok(db)
  })

  test('postgres', async ({ ok }) => {
    const { db, queryer } = await setupDatabase(logger, 'postgres', postgresOptions)
    const tableName = 'common_table_test'
    await createTable(queryer, tableName)
    await insertIntoTable(queryer, tableName)
    await queryer[privateMethods].dropTable(tableName)
    await killDatabase(db)

    ok(db)
  })

  end()
})

test('should delete data', ({ end }) => {
  test('mysql', async ({ ok }) => {
    const { db, queryer } = await setupDatabase(logger, 'mysql', mysqlOptions)
    const tableName = 'common_table_test'
    await createTable(queryer, tableName)
    await insertIntoTable(queryer, tableName)
    await queryer[privateMethods].deleteData(tableName, { id: 1 })
    await queryer[privateMethods].dropTable(tableName)
    await killDatabase(db)

    ok(db)
  })

  test('postgres', async ({ ok }) => {
    const { db, queryer } = await setupDatabase(logger, 'postgres', postgresOptions)
    const tableName = 'common_table_test'
    await createTable(queryer, tableName)
    await insertIntoTable(queryer, tableName)
    await queryer[privateMethods].deleteData(tableName, { id: 1 })
    await queryer[privateMethods].dropTable(tableName)
    await killDatabase(db)

    ok(db)
  })

  end()
})

test('should update data', ({ end }) => {
  test('mysql', async ({ ok }) => {
    const { db, queryer } = await setupDatabase(logger, 'mysql', mysqlOptions)
    const tableName = 'common_table_test'
    await createTable(queryer, tableName)
    await insertIntoTable(queryer, tableName)
    await queryer[privateMethods].updateData(tableName, { id: 1 }, { name: 'test2' })
    await queryer[privateMethods].dropTable(tableName)
    await killDatabase(db)

    ok(db)
  })

  test('postgres', async ({ ok }) => {
    const { db, queryer } = await setupDatabase(logger, 'postgres', postgresOptions)
    const tableName = 'common_table_test'
    await createTable(queryer, tableName)
    await insertIntoTable(queryer, tableName)
    await queryer[privateMethods].updateData(tableName, { id: 1 }, { name: 'test2' })
    await queryer[privateMethods].dropTable(tableName)
    await killDatabase(db)

    ok(db)
  })

  end()
})
