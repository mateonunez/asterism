import { test } from 'tap'
import { generateConnectionString } from '../lib/database.js'
import huston from '@asterism/huston'

const { mysqlOptions, postgresOptions } = huston

test('should generate correctly the connection string', ({ end }) => {
  test('mysql', async ({ same }) => {
    const { mysql } = generateConnectionString(mysqlOptions)
    same(mysql, 'mysql://root:toor@127.0.0.1:3306/db')
  })

  test('postgres', async ({ same }) => {
    const { postgres } = generateConnectionString(postgresOptions)
    same(postgres, 'postgres://postgres:toor@127.0.0.1:5432/db')
  })

  end()
})
