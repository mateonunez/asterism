import { test } from 'node:test'
import { tspl } from '@matteo.collina/tspl'
import setupDatabase, { killDatabase } from './../drill.js'
import symbols from '../lib/symbols.js'
import huston from '@mateonunez/asterism-huston'

const { postgresOptions, logger } = huston
const { privateMethods } = symbols

test('should create a new database', async (t) => {
  const { ok } = tspl(t, { plan: 4 })

  const { db: _db, queryer } = await setupDatabase(logger, 'postgres', postgresOptions)
  const databaseName = 'new_database'
  await queryer[privateMethods].createDatabase(databaseName, { dropIfExists: true })
  await killDatabase(_db)
  const { db } = await setupDatabase(logger, 'postgres', { ...postgresOptions, databaseName })
  await killDatabase(db)

  ok(db)
  ok(_db)
  ok(db._disposed)
  ok(_db._disposed)
})

test('should create and retrieve a new table', async (t) => {
  t.after(async () => {
    await killDatabase(db)
  })

  const { ok } = tspl(t, { plan: 2 })

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

  ok(tables.length > 0)
  ok(tables.includes(tableName))
})

test('should create and retrieve a single table', async (t) => {
  t.after(async () => {
    await killDatabase(db)
  })

  const { ok } = tspl(t, { plan: 1 })

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

  const table = await queryer.getTable('test')

  ok(table === tableName)
})

// test('should retrieve single table', async ({ ok, end }) => {
//   const { db, queryer } = await setupDatabase(logger, 'postgres', postgresOptions)
//   const tableName = 'test'
//   await queryer[privateMethods].createTable(tableName, {
//     id: {
//       type: 'int',
//       primaryKey: true
//     },
//     name: {
//       type: 'varchar',
//       length: 255
//     }
//   }, { dropIfExists: true })

//   const tables = await queryer.getTable('test')
//   await killDatabase(db)

//   ok(tables)
//   end()
// })
