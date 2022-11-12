import { test } from 'tap'
import { generateSchema, generateAsterism } from '../rover.js'
import huston from '@mateonunez/asterism-huston'

const { logger } = huston

test('should generate schema', async ({ ok }) => {
  const data = {
    users: [
      {
        name: 'John',
        age: 30
      },
      {
        name: 'Jane',
        age: 28
      }
    ]
  }
  const schema = generateSchema(logger, data)
  ok(schema.users)
})

test('shouldn\'t generate schema with empty properties', async ({ same }) => {
  const data = {
    users: [
      {
        name: 'John',
        age: 30
      },
      {
        name: 'Jane',
        age: 28
      }
    ],
    empty: []
  }
  const schema = generateSchema(logger, data)
  same(schema, { users: { name: 'string', age: 'number' } })
})

test('should generate an aestirsm', async ({ ok }) => {
  const data = {
    users: [
      {
        name: 'John',
        age: 30
      },
      {
        name: 'Jane',
        age: 28
      }
    ]
  }
  const schema = generateSchema(logger, data)
  const asterism = generateAsterism(logger, data, schema)
  ok(asterism)
})
