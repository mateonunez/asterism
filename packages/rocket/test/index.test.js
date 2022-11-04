import seeder from '@asterism/drill/lib/seeder.js'
import t from 'tap'
import rocket from '../rocket.js'
import { defaultOptions } from './helper.js'

t.before(async () => {
  await seeder(undefined, 'mysql', defaultOptions)
})

t.test('no database selected should default to mysql', async ({ ok }) => {
  const { db } = await rocket(undefined, { ...defaultOptions, tableName: 'users' })
  ok(db.isMysql)
})

t.test('table name', async ({ ok }) => {
  const { db } = await rocket('mysql', { ...defaultOptions, tableName: 'users' })
  ok(db.isMysql)
})

t.on('end', async () => {
  console.log('end')
})
