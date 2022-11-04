#!/usr/bin/env node

import { program } from 'commander'
import version from './lib/version.js'
import { allowedDatabases } from '@asterism/drill/lib/database.js'
import rocket from '@asterism/rocket'

program.name('asterism').description('Asterism CLI').version(version, '-v, --version', 'output the current version')

program
  .command('migrate')
  .description('Initialize a new Lyra instance from your current database')
  .argument('[database]', 'The database to migrate', (value) => (allowedDatabases.includes(value) ? value : undefined))
  .option('-H, --host <host>', 'Database host', '127.0.0.1')
  .option('-h, --port <port>', 'Port to run the server on', '3306')
  .option('-d, --databaseName <databaseName>', 'Database connection string')
  .option('-t --tableName <tableName>', 'Table name')
  .option('-u, --user <user>', 'Database user', 'root')
  .option('-w, --password <password>', 'Database password', 'toor')
  .option('-o, --output <output>', 'Output directory', './out')
  .action(rocket)

program.parse()
