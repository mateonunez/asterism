import { test } from 'tap'
import { execa } from 'execa'
import cliPath from '../lib/cli-path.js'
import version from '../lib/version.js'

test('version', async ({ same }) => {
  const { stdout } = await execa('node', [cliPath, '--version'])
  same(stdout, version)
})

test('help', async ({ ok }) => {
  const { stdout } = await execa('node', [cliPath, '--help'])

  ok(stdout.includes('Usage: asterism [options] [command]'))
})

test('migrate', async ({ ok }) => {
  const { stdout } = await execa('node', [cliPath, 'migrate', '--help'])

  ok(stdout.includes('Usage: asterism migrate [options] [database]'))
})
