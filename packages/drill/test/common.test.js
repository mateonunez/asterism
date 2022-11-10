import { test } from 'tap'
import setupDatabase, { killDatabase } from './../drill.js'
import logger from './helpers/logger.js'
import symbols from '../lib/symbols.js'
import huston from '@asterism/huston'

const { mysqlOptions, postgresOptions } = huston
const { privateMethods } = symbols

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
    const tableName = 'test'
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

    await queryer[privateMethods].dropTable(tableName)
    await killDatabase(db)
    ok(db)
  })

  test('postgres', async ({ ok }) => {
    const { db, queryer } = await setupDatabase(logger, 'postgres', postgresOptions)
    const tableName = 'test'
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

    await queryer[privateMethods].dropTable(tableName)
    await killDatabase(db)
    ok(db)
  })

  end()
})

test('should insert data into a table', ({ end }) => {
  test('mysql', async ({ ok }) => {
    const { db, queryer } = await setupDatabase(logger, 'mysql', mysqlOptions)
    const tableName = 'test'
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

    await queryer[privateMethods].insertData(tableName, {
      id: 1,
      name: 'test'
    })

    await queryer[privateMethods].dropTable(tableName)
    await killDatabase(db)
    ok(db)
  })

  test('postgres', async ({ ok }) => {
    const { db, queryer } = await setupDatabase(logger, 'postgres', postgresOptions)
    const tableName = 'test'
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

    await queryer[privateMethods].insertData(tableName, {
      id: 1,
      name: 'test'
    })

    await queryer[privateMethods].dropTable(tableName)
    await killDatabase(db)
    ok(db)
  })

  end()
})
