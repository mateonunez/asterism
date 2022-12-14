import { test } from 'tap'
import validateOptions from '@mateonunez/asterism-drill/lib/validate-options.js'
import { logger } from '@mateonunez/asterism-huston'

test('should validate options', async ({ end }) => {
  test('mysql', async ({ same }) => {
    const validatedOptions = validateOptions(logger, 'mysql', {})

    same(validatedOptions, {
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: 'toor',
      outputDir: './out',
      inputDir: './lyra'
    })
  })

  test('postgres', async ({ same }) => {
    const validatedOptions = validateOptions(logger, 'postgres', {})

    same(validatedOptions, {
      host: '127.0.0.1',
      port: 5432,
      user: 'postgres',
      password: 'postgres',
      outputDir: './out',
      inputDir: './lyra'
    })
  })

  end()
})
