#!/usr/bin/env node

import { program } from 'commander'
import version from './lib/version.js'
import { allowedDatabases } from '@mateonunez/asterism-drill/lib/database.js'
import { falconMigrate, falconSearch } from '@mateonunez/asterism-falcon'

program.name('asterism').description('Asterism CLI').version(version, '-v, --version', 'output the current version')

program
  .command('migrate')
  .description('Initialize a new Orama instance from your current database')
  .argument('[database]', 'The database to migrate (mysql or postgres)', (value) => (allowedDatabases.includes(value) ? value : undefined))
  .option('-H, --host <host>', 'Database host')
  .option('-p, --port <port>', 'Port to run the server on')
  .option('-d, --databaseName <databaseName>', 'Database connection string')
  .option('-t, --tableName <tableName>', 'Table name')
  .option('-u, --user <user>', 'Database user')
  .option('-w, --password <password>', 'Database password')
  .option('-o, --outputDir <outputDir>', 'Orama migrated databases directory', './orama')
  .option('-s --strict', 'Strict mode', false)
  .action(falconMigrate)

program
  .command('search')
  .description('Search for a Orama instance in your instances')
  .argument('[term]', 'The term to search for')
  .option('-c, --cacheDisabled', 'Disable cache')
  .option('-i, --inputDir <inputDir>', 'Orama databases directory', './orama')
  .option('-o, --outputDir <outputDir>', 'Output directory to save results in a JSON', './out')
  .action(falconSearch)

program.parse()
