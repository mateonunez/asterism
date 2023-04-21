import { test } from 'tap'
import setupDatabase, { killDatabase } from './../drill.js'
import symbols from '../lib/symbols.js'
import { database, logger } from '@mateonunez/asterism-huston'

const { postgresOptions } = database
const { privateMethods } = symbols

test('should create a new database', async ({ ok, end }) => {
  const { db: _db, queryer } = await setupDatabase(logger, 'postgres', postgresOptions)
  const databaseName = 'new_database'
  await queryer[privateMethods].createDatabase(databaseName, { dropIfExists: true })
  await killDatabase(_db)
  const { db } = await setupDatabase(logger, 'postgres', { ...postgresOptions, databaseName })
  await queryer[privateMethods].dropDatabase(databaseName)
  await killDatabase(db)

  ok(_db)
  end()
})

test('should retrieve tables', async ({ ok, end }) => {
  const { db, queryer } = await setupDatabase(logger, 'postgres', postgresOptions)
  const databaseName = 'new_database_2'
  await queryer[privateMethods].createDatabase(databaseName, { dropIfExists: true })
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

  const tables = await queryer.getTables()
  await queryer[privateMethods].dropDatabase(databaseName)
  await killDatabase(db)

  ok(tables.length > 0)
  end()
})

test('should retrieve single table', async ({ ok, end }) => {
  const { db, queryer } = await setupDatabase(logger, 'postgres', postgresOptions)
  const databaseName = 'new_database_3'
  await queryer[privateMethods].createDatabase(databaseName, { dropIfExists: true })
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

  const tables = await queryer.getTable('test')
  await queryer[privateMethods].dropDatabase(databaseName)
  await killDatabase(db)

  ok(tables)
  end()
})

test('should log warning when table does not exist', async ({ same, end }) => {
  const { db, queryer } = await setupDatabase(undefined, 'postgres', postgresOptions)
  await queryer[privateMethods].createDatabase('empty_database', { dropIfExists: true })
  const tables = await queryer.getTables()
  await queryer[privateMethods].dropDatabase('empty_database')
  await killDatabase(db)

  same(tables, [])
  end()
})
