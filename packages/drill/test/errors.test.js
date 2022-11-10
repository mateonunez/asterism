import { test } from 'tap'
import setupDatabase from '../drill.js'

test('should throw an error when the database is not support', async ({ ok }) => {
  try {
    await setupDatabase(null, 'oracle', {})
  } catch (err) {
    ok(err)
  }
})

test('should throw an error when the parameters are wront', async ({ ok }) => {
  try {
    await setupDatabase(null, 'mysql', { user: 'fake', password: 'kaboom' })
  } catch (err) {
    ok(err)
  }
})
