import seeder, { dropSeed } from '@mateonunez/asterism-drill/lib/seeder.js'
import t from 'tap'
import { falconMigrate, falconSearch } from '../falcon.js'
import huston from '@mateonunez/asterism-huston'

const { mysqlOptions, postgresOptions } = huston

t.before(async () => {
  await seeder(undefined, 'mysql', { ...mysqlOptions, outputDir: './lyra' })
})

t.test('no database selected should default to mysql', async ({ ok }) => {
  const { db } = await falconMigrate(undefined, { ...mysqlOptions, outputDir: './lyra' })
  ok(db.isMysql)
})

t.test('postgres database selected', async ({ ok }) => {
  const { db } = await falconMigrate('postgres', { ...postgresOptions, outputDir: './lyra' })
  ok(db.isPostgres)
})

t.test('falcon search with no term should terminate the process', async ({ same }) => {
  await falconMigrate(undefined, mysqlOptions)
  const results = await falconSearch(undefined, { inputDir: './lyra' })
  same(results, undefined)
})

t.test('falcon search should return results', async ({ ok }) => {
  await falconMigrate(undefined, mysqlOptions)
  const results = await falconSearch('John', { inputDir: './lyra' })
  ok(results)
})

t.on('end', async () => {
  await dropSeed(undefined, 'mysql', { ...mysqlOptions, outputDir: './lyra' })
})
