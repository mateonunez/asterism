import { test } from 'node:test'
import assert from 'node:assert'
import setupDatabase from '../drill.js'

test('should rejects with error when the database is not support', async () => {
  assert.rejects(async () => {
    await setupDatabase(null, 'oracle', {})
  }, {
    name: 'Error',
    message: 'The database "oracle" is not supported.'
  })
})

test('should reject with error when the parameters are wrong', async () => {
  assert.rejects(async () => {
    await setupDatabase(null, 'mysql', { user: 'fake', password: 'kaboom' })
  }, {
    name: 'Error',
    message: /Could not connect to mysql database at/
  })
})
