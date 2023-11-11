import { test } from 'node:test'
import assert from 'node:assert'
import { generateConnectionString } from '../lib/database.js'
import huston from '@mateonunez/asterism-huston'

const { mysqlOptions, postgresOptions } = huston

test('should generate correctly the connection string', async (t) => {
  await t.test('mysql', async () => {
    const { mysql } = generateConnectionString(mysqlOptions)
    assert.strictEqual(mysql, 'mysql://root:toor@127.0.0.1:3306/db')
  })

  await t.test('postgres', async () => {
    const { postgres } = generateConnectionString(postgresOptions)
    assert.strictEqual(postgres, 'postgres://postgres:toor@127.0.0.1:5432/db')
  })
})
