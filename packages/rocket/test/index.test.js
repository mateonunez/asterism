import seeder, { dropSeed } from '@asterism/drill/lib/seeder.js'
import t from 'tap'
import rocket from '../rocket.js'
import huston from '@asterism/huston'

const { mysqlOptions, postgresOptions } = huston

t.before(async () => {
  await seeder(undefined, 'mysql', mysqlOptions)
})

t.test('no database selected should default to mysql', async ({ ok }) => {
  const { db } = await rocket(undefined, mysqlOptions)
  ok(db.isMysql)
})

t.test('postgres database selected', async ({ ok }) => {
  const { db } = await rocket('postgres', postgresOptions)
  ok(db.isPostgres)
})

t.on('end', async () => {
  await dropSeed(undefined, 'mysql', mysqlOptions)
})
