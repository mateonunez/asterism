import fs from 'node:fs'
import path from 'node:path'
import { test } from 'tap'
import { generateSchema, generateAsterism, populateAsterism, resolveAsterism, searchOnAsterism, saveSearchResults } from '../rover.mjs'
import { logger } from '@mateonunez/asterism-huston'

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
  const asterism = await generateAsterism(logger, data, schema)
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
  const asterism = await generateAsterism(logger, data, schema)
  await populateAsterism(logger, asterism, { outputDir: './orama' })
  ok(asterism)
})

test('should resolve asterism', async ({ ok }) => {
  const asterism = await resolveAsterism(logger, { inputDir: './orama' })
  ok(asterism)
})

test('should search on asterism', async ({ ok }) => {
  const asterism = await resolveAsterism(logger, { inputDir: './orama' })
  const results = await searchOnAsterism(logger, asterism, 'John')
  ok(results)
})

test('should perform a cached search', async ({ ok }) => {
  const asterism = await resolveAsterism(logger, { inputDir: './orama' })
  const results = await searchOnAsterism(logger, asterism, 'John')
  ok(results[Object.keys(results)[0]].cached)
})

test('should perform a non-cached search', async ({ equal }) => {
  const asterism = await resolveAsterism(logger, { inputDir: './orama' })
  const results = await searchOnAsterism(logger, asterism, 'John', { cacheDisabled: true })

  equal(results[Object.keys(results)[0]].cached, undefined)
})

test('should save search results in a json file', async ({ ok }) => {
  const asterism = await resolveAsterism(logger, { inputDir: './orama' })
  await searchOnAsterism(logger, asterism, 'John', { outputDir: './out' })
  ok(true)
})

test('throws an error with invalid outputDir', async ({ error }) => {
  const asterism = await resolveAsterism(logger, { inputDir: './orama' })
  try {
    await searchOnAsterism(logger, asterism, 'John', {})
  } catch (err) {
    error(err)
  }
})

test('should save search results using saveSearchResults', async ({ ok }) => {
  const results = {
    users: [
      {
        name: 'John',
        score: 0.99
      },
      {
        name: 'Jane',
        score: 0.56
      }
    ]
  }
  const outputDir = './outputTest'
  const savedPath = saveSearchResults(logger, results, { outputDir })

  const fileExists = fs.existsSync(savedPath)
  if (fileExists) {
    const savedData = fs.readFileSync(savedPath, 'utf8')
    const jsonData = JSON.parse(savedData)
    ok(jsonData.users && jsonData.users.length === 2, 'Should have saved the correct data')
    // Clean up test data (comment this out if you want to inspect the file)
    fs.unlinkSync(savedPath)
    fs.rmdirSync(path.resolve(outputDir))
  } else {
    ok(false, 'File was not saved correctly')
  }
})
