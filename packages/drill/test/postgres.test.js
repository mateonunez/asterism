import { test } from 'tap'
import setupDatabase, { killDatabase } from './../drill.js'
import logger from './helpers/logger.js'
import symbols from '../lib/symbols.js'
import huston from '@asterism/huston'

const { postgresOptions } = huston
const { privateMethods } = symbols

test('should create a new database', async ({ ok, end }) => {
  const { db: _db, queryer } = await setupDatabase(logger, 'postgres', postgresOptions)
  const databaseName = 'new_database'
  await queryer[privateMethods].createDatabase(databaseName, { dropIfExists: true })
  await killDatabase(_db)
  const { db } = await setupDatabase(logger, 'postgres', { ...postgresOptions, databaseName })
  await killDatabase(db)

  ok(_db)
  end()
})

test('should retrieve tables', async ({ ok, end }) => {
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

  const tables = await queryer.getTables()
  await killDatabase(db)

  ok(tables.length > 0)
  end()
})

test('should retrieve single table', async ({ ok, end }) => {
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

  const tables = await queryer.getTable('test')
  await killDatabase(db)

  ok(tables)
  end()
})
