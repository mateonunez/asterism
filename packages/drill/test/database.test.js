import { test } from 'tap'
import { generateConnectionString } from '../lib/database.js'
import { database } from '@mateonunez/asterism-huston'

const { mysqlOptions, postgresOptions } = database

test('should generate correctly the connection string', ({ end }) => {
  test('mysql', async ({ equal }) => {
    const { mysql } = generateConnectionString(mysqlOptions)
    equal(mysql, 'mysql://root:toor@127.0.0.1:3306/db')
  })

  test('postgres', async ({ equal }) => {
    const { postgres } = generateConnectionString(postgresOptions)
    equal(postgres, 'postgres://postgres:toor@127.0.0.1:5432/db')
  })

  end()
})
