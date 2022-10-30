import { test } from 'tap'
import rocket from '../rocket.js'
import { defaultOptions } from './helper.js'

test('no database selected should default to mysql', async ({ ok }) => {
  const { db } = await rocket(undefined, defaultOptions)
  ok(db.isMysql)
})

test('table name', async ({ ok }) => {
  const { db } = await rocket('mysql', { ...defaultOptions, tableName: 'users' })
  ok(db.isMysql)
})
