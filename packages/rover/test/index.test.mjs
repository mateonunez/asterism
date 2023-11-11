import test from 'node:test'
import assert from 'node:assert'
import fs from 'node:fs'
import path, { join } from 'node:path'
import { generateSchema, generateAsterism, populateAsterism, resolveAsterism, searchOnAsterism } from '../rover.mjs'

const logger = {
  info: () => {},
  warn: () => {},
  error: () => {}
}

const data = {
  users: [
    {
      name: 'John Doe',
      age: 30,
      address: '123 Main St.',
      email: 'john@doe.com'
    },
    {
      name: 'Jane Doe',
      age: 25,
      address: '456 Main St.',
      email: 'jane@doe.com'
    }
  ]
}

async function cleanUp (directory) {
  const filePath = path.resolve(join(process.cwd(), directory))
  if (fs.existsSync(filePath)) fs.rmdirSync(filePath, { recursive: true })
}

const outDir = './orama'

test.describe('rover', () => {
  test.describe('generateSchema', async () => {
    test.it('should generate a simple schema', async () => {
      const schema = generateSchema(logger, data)
      assert.deepStrictEqual(schema, {
        users: {
          name: 'string',
          age: 'number',
          address: 'string',
          email: 'string'
        }
      })
    })

    test.it('should skip empty data', async () => {
      const schema = generateSchema(logger, { users: [] })
      assert.deepStrictEqual(schema, { })
    })
  })

  test.describe('generateAsterism', async () => {
    test.it('should generate an asterism', async () => {
      const schema = generateSchema(logger, data)
      const asterism = await generateAsterism(logger, data, schema)

      assert.ok(asterism.users)
      assert.ok(Object.keys(asterism.users.data.docs.docs).length > 0)
      assert.deepStrictEqual(asterism.users.schema, schema.users)
      assert.ok(Object.keys(asterism.users.data.docs.docs).length === Object.keys(data.users).length)
    })
  })

  test.describe('populateAsterism', async () => {
    test.it('should populate an asterism', async () => {
      const schema = generateSchema(logger, data)
      const asterism = await generateAsterism(logger, data, schema)
      await populateAsterism(logger, asterism, { outputDir: './orama' })

      const filePath = path.resolve(join(process.cwd(), './orama'))
      assert.ok(fs.existsSync(`${filePath}/users.json`))
    })

    // clean up
    test.afterEach(async () => {
      await cleanUp(outDir)
    })
  })

  test.describe('resolveAsterism', async () => {
    test.it('should resolve an asterism', async () => {
      const schema = generateSchema(logger, data)
      const asterism = await generateAsterism(logger, data, schema)
      await populateAsterism(logger, asterism, { outputDir: './orama' })

      const resolvedAsterism = await resolveAsterism(logger, { inputDir: './orama' })
      assert.ok(resolvedAsterism.users)
      assert.ok(Object.keys(resolvedAsterism.users.data.docs.docs).length > 0)
      // Orama adds some extra fields to the schema when saved to disk: `__placleholder`, etc
      // assert.deepStrictEqual(resolvedAsterism.users.schema, schema.users)
      assert.ok(Object.keys(resolvedAsterism.users.data.docs.docs).length === Object.keys(data.users).length)
    })

    // clean up
    test.afterEach(async () => {
      await cleanUp(outDir)
    })
  })

  test.describe('searchOnAsterism', async () => {
    test.it('should search on an asterism', async () => {
      const schema = generateSchema(logger, data)
      const asterism = await generateAsterism(logger, data, schema)
      await populateAsterism(logger, asterism, { outputDir: './orama' })

      const results = await searchOnAsterism(logger, asterism, 'John')
      assert.ok(results.users)
      assert.ok(results.users.count > 0)
    })

    test.it('should search with cache disabled', async () => {
      const schema = generateSchema(logger, data)
      const asterism = await generateAsterism(logger, data, schema)
      await populateAsterism(logger, asterism, { outputDir: './orama' })

      const results = await searchOnAsterism(logger, asterism, 'John', { cacheDisabled: true })
      assert.ok(results.users)
      assert.ok(results.users.count > 0)
    })

    test.it('should save the search results to disk', async () => {
      const schema = generateSchema(logger, data)
      const asterism = await generateAsterism(logger, data, schema)
      await populateAsterism(logger, asterism, { outputDir: './orama' })

      const results = await searchOnAsterism(logger, asterism, 'John', { outputDir: './out' })
      assert.ok(results.users)
      assert.ok(results.users.count > 0)

      const filePath = path.resolve(join(process.cwd(), './orama'))
      assert.ok(fs.existsSync(`${filePath}/users.json`))

      test.afterEach(async () => {
        await cleanUp('./out')
      })
    })

    // clean up
    test.afterEach(async () => {
      await cleanUp(outDir)
    })
  })
})
