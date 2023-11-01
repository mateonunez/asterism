import test from 'node:test'
import assert from 'node:assert'
import seeder, { dropSeed } from '@mateonunez/asterism-drill/lib/seeder.js'
import { falconMigrate, falconSearch } from '../falcon.js'
import { database } from '@mateonunez/asterism-huston'

const { mysqlOptions, postgresOptions } = database

const logger = {
  info: () => {},
  warn: () => {},
  error: () => {}
}

test.describe('falcon', () => {
  test.before(async () => {
    await seeder(logger, 'mysql', { ...mysqlOptions, outputDir: './orama' })
  })

  test.after(async () => {
    await dropSeed(logger, 'mysql', { ...mysqlOptions, outputDir: './orama' })
  })

  test.describe('falcon migrate', async () => {
    test.it('no database selected should default to mysql', async () => {
      const { db } = await falconMigrate(undefined, { ...mysqlOptions, outputDir: './orama' }, logger)
      assert.equal(db.isMysql, true)
    })

    test.it('postgres database selected', async () => {
      const { db } = await falconMigrate('postgres', { ...postgresOptions, outputDir: './orama' }, logger)
      assert.equal(db.isPostgres, true)
    })

    test.it('should throw an error if the database is not supported', async () => {
      try {
        await falconMigrate('mongodb', { ...mysqlOptions, outputDir: './orama' }, logger)
      } catch (error) {
        assert.equal(error.message, 'The database "mongodb" is not supported.')
      }
    })

    test.it('should close the database connection', async () => {
      const { db } = await falconMigrate('mysql', { ...mysqlOptions, outputDir: './orama' }, logger)
      assert.equal(db.isClosed, true)
    })
  })

  test.describe('falcon search', async () => {
    test.it('no term should terminate the process', async () => {
      await falconMigrate(undefined, mysqlOptions, logger)
      const results = await falconSearch(undefined, { inputDir: './orama' })
      assert.equal(results, undefined)
    })

    test.it('should return results', async () => {
      await falconMigrate('mysql', mysqlOptions, logger)
      const results = await falconSearch('John', { inputDir: './orama' }, logger)
      const asterismKey = Object.keys(results)[0]
      assert.ok(results[asterismKey].count > 0)
    })
  })
})
