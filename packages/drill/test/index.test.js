import { test } from 'node:test'
import { tspl } from '@matteo.collina/tspl'
import setupDatabase, { killDatabase, resolveTables, resolveData } from '../drill.js'
import huston from '@mateonunez/asterism-huston'

const { mysqlOptions, postgresOptions, logger } = huston
const supportedDatabases = [
  { name: 'mysql', options: mysqlOptions },
  { name: 'postgres', options: postgresOptions }
]

test('database', async (t) => {
  await t.test('the database should setup correctly', async (t) => {
    const { ok } = tspl(t, { plan: 4 })

    for (const database of supportedDatabases) {
      await t.test(database.name, async (t) => {
        t.after(async () => {
          await killDatabase(db)
        })

        const { db, queryer } = await setupDatabase(logger, database.name, database.options)
        ok(db)
        ok(queryer)
      })
    }
  })

  await t.test('the database should dispose correctly', async (t) => {
    const { ok } = tspl(t, { plan: 2 })

    for (const database of supportedDatabases) {
      await t.test(database.name, async () => {
        const { db } = await setupDatabase(logger, database.name, database.options)
        await killDatabase(db)
        ok(db._disposed)
      })
    }
  })

  await t.test('the database should resolve tables correctly', async (t) => {
    const { ok } = tspl(t, { plan: 2 })

    for (const database of supportedDatabases) {
      await t.test(database.name, async (t) => {
        t.after(async () => {
          await killDatabase(db)
        })

        const { db, queryer } = await setupDatabase(logger, database.name, database.options)
        const tables = await resolveTables(logger, queryer, database.options)
        ok(tables)
      })
    }
  })

  await t.test('the database should resolve single table correctly', async (t) => {
    const { ok } = tspl(t, { plan: 2 })

    for (const database of supportedDatabases) {
      await t.test(database.name, async () => {
        t.after(async () => {
          await killDatabase(db)
        })

        const { db, queryer } = await setupDatabase(logger, database.name, database.options)
        const tables = await resolveTables(logger, queryer, { ...database.options, tableName: 'users' })
        ok(tables)
      })
    }
  })

  await t.test('the database should resolve data correctly', async (t) => {
    const { ok } = tspl(t, { plan: 2 })

    for (const database of supportedDatabases) {
      await t.test(database.name, async (t) => {
        t.after(async () => {
          await killDatabase(db)
        })

        const { db, queryer } = await setupDatabase(logger, database.name, database.options)
        const tables = await resolveTables(logger, queryer, database.options)
        const data = await resolveData(logger, queryer, tables, database.options)
        ok(data)
      })
    }
  })
})
