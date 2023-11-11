import test from 'node:test'
import assert from 'node:assert'
import { execa } from 'execa'
import cliPath from '../lib/cli-path.js'
import version from '../lib/version.js'

test.describe('version', async () => {
  test.it('should match package.json version', async () => {
    const { stdout } = await execa('node', [cliPath, '--version'])
    assert.equal(stdout, version)
  })
})

test.describe('help', async () => {
  test.it('should display help', async () => {
    const { stdout } = await execa('node', [cliPath, '--help'])
    assert.ok(stdout.includes('Usage: asterism [options] [command]'))
  })
})

test.describe('migrate', async () => {
  test.it('should display help', async () => {
    const { stdout } = await execa('node', [cliPath, 'migrate', '--help'])
    assert.ok(stdout.includes('Usage: asterism migrate [options] [database]'))
  })
})
