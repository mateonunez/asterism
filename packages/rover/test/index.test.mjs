import { test } from 'tap'
import { generateSchema, generateAsterism, populateAsterism, resolveAsterism, searchOnAsterism } from '../rover.js'
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

test('should persist an asterism', async ({ ok }) => {
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
  populateAsterism(logger, asterism, { outputDir: './lyra' })
  ok(asterism)
})

test('should resolve asterism', async ({ ok }) => {
  const asterism = resolveAsterism(logger, { inputDir: './lyra' })
  ok(asterism)
})

test('should search on asterism', async ({ ok }) => {
  const asterism = resolveAsterism(logger, { inputDir: './lyra' })
  const results = await searchOnAsterism(logger, asterism, 'John')
  ok(results)
})

test('should perform a cached search', async ({ ok }) => {
  const asterism = resolveAsterism(logger, { inputDir: './lyra' })
  const results = await searchOnAsterism(logger, asterism, 'John', { cacheEnabled: true })
  ok(results[Object.keys(results)[0]].cached)
})

test('should save search results in a json file', async ({ ok }) => {
  const asterism = resolveAsterism(logger, { inputDir: './lyra' })
  await searchOnAsterism(logger, asterism, 'John', { outputDir: './' })
  ok(true)
})

test('throws an error with invalid outputDir', async ({ error }) => {
  const asterism = resolveAsterism(logger, { inputDir: './lyra' })
  try {
    await searchOnAsterism(logger, asterism, 'John', {})
  } catch (err) {
    error(err)
  }
})
