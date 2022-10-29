import { kill } from '@asterism/drill'
import { test } from 'tap'
import rocket from '../rocket.js'
import { defaultOptions } from './helper.js'

test('no database selected should default to mysql', async ({ ok }) => {
  const { db } = await rocket(undefined, defaultOptions)
  await kill(db)
  ok(db.isMysql)
})
