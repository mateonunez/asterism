import { test } from 'tap'
import setupDatabase, { killDatabase } from '../drill.js'
import huston from '@asterism/huston'

const { mysqlOptions } = huston

test('the database should setup correctly', async ({ teardown, ok }) => {
  const { db, queryer } = await setupDatabase(undefined, 'mysql', mysqlOptions)

  ok(db)
  ok(queryer)

  teardown(() => killDatabase(db))
})
