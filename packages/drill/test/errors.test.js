import { test } from 'tap'
import setupDatabase from '../drill.js'

test('should throw an error when the database is not support', async ({ rejects }) => {
  await rejects(setupDatabase(null, 'fake', {}), 'Database not supported')
})

test('should throw an error when the parameters are wront', async ({ rejects }) => {
  await rejects(setupDatabase(null, 'mysql', { user: 'fake', password: 'kaboom' }), 'Error connecting to database')
})
