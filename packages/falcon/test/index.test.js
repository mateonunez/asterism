import seeder, { dropSeed } from '@mateonunez/asterism-drill/lib/seeder.js'
import t from 'tap'
import { falconMigrate, falconSearch } from '../falcon.js'
import huston from '@mateonunez/asterism-huston'

const { mysqlOptions, postgresOptions } = huston

t.before(async () => {
  await seeder(undefined, 'mysql', mysqlOptions)
})

t.test('no database selected should default to mysql', async ({ ok }) => {
  const { db } = await falconMigrate(undefined, mysqlOptions)
  ok(db.isMysql)
})

t.test('postgres database selected', async ({ ok }) => {
  const { db } = await falconMigrate('postgres', postgresOptions)
  ok(db.isPostgres)
})

t.test('falcon search with no term should terminate the process', async ({ same }) => {
  await falconMigrate(undefined, mysqlOptions)
  const results = falconSearch(undefined, { outputDir: './out' })
  same(results, undefined)
})

t.test('falcon search should return results', async ({ ok }) => {
  await falconMigrate(undefined, mysqlOptions)
  const results = falconSearch('John', mysqlOptions)
  ok(results)
})

t.on('end', async () => {
  await dropSeed(undefined, 'mysql', mysqlOptions)
})
