import seeder, { dropSeed } from '@mateonunez/asterism-drill/lib/seeder.js'
import t from 'tap'
import falcon from '../falcon.js'
import huston from '@mateonunez/asterism-huston'

const { mysqlOptions, postgresOptions } = huston

t.before(async () => {
  await seeder(undefined, 'mysql', mysqlOptions)
})

t.test('no database selected should default to mysql', async ({ ok }) => {
  const { db } = await falcon(undefined, mysqlOptions)
  ok(db.isMysql)
})

t.test('postgres database selected', async ({ ok }) => {
  const { db } = await falcon('postgres', postgresOptions)
  ok(db.isPostgres)
})

t.on('end', async () => {
  await dropSeed(undefined, 'mysql', mysqlOptions)
})
