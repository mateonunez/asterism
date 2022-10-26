#!/usr/bin/env node

import { program } from 'commander'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { allowedDatabases } from '@asterism/drill/lib/database.js'
import rocket from '@asterism/rocket'

const root = new URL('.', import.meta.url).pathname.replace(/\/$/, '')
const { version } = JSON.parse(readFileSync(resolve(root, '../../package.json'), 'utf8'))

program.name('asterism').description('Asterism CLI').version(version, '-v, --version', 'output the current version')

program
  .command('migrate', 'Start a database migration to a Lyra instance')
  .description('Initialize a new Lyra instance from your current database')
  .alias('i')
  .argument('[database]', 'The database to migrate', (value) => (allowedDatabases.includes(value) ? value : undefined))
  .option('-H, --host <host>', 'Database host', 'localhost')
  .option('-h, --port <port>', 'Port to run the server on', '3306')
  .option('-d, --databaseName <databaseName>', 'Database connection string', 'asterism')
  .option('-u, --user <user>', 'Database user', 'root')
  .option('-w, --password <password>', 'Database password', 'toor')
  .option('-o, --output <output>', 'Output directory', 'lyra')
  .action(rocket)

program.parse()
