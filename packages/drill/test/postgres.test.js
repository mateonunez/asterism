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
