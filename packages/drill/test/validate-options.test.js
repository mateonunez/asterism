import test from 'node:test'
import assert from 'node:assert'
import huston from '@mateonunez/asterism-huston'
import validateOptions from '../lib/validate-options.js'

const { logger } = huston

test.describe('validate options', () => {
  test.it('mysql', async () => {
    const validatedOptions = validateOptions(logger, 'mysql', {})

    assert.deepStrictEqual(validatedOptions, {
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: 'toor',
      outputDir: './out',
      inputDir: './orama'
    })
  })

  test.it('postgres', () => {
    const validatedOptions = validateOptions(logger, 'postgres', {})

    assert.deepStrictEqual(validatedOptions, {
      host: '127.0.0.1',
      port: 5432,
      user: 'postgres',
      password: 'postgres',
      outputDir: './out',
      inputDir: './orama'
    })
  })
})
