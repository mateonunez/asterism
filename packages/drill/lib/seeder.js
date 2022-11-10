import setupDatabase, { killDatabase } from '../drill.js'
import symbols from './symbols.js'

const { privateMethods } = symbols

export default async function (logger, database, options) {
  const { db, queryer } = await setupDatabase(logger, database, options)
  await queryer[privateMethods].createDatabase(options.databaseName)
  const table = queryer.getTable('example')
  await queryer[privateMethods].createTable(table, {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: 'varchar',
      length: 255
    }
  }, {
    dropTable: true
  })

  await queryer[privateMethods].insertData('example', { name: 'John' })
  await queryer[privateMethods].insertData('example', { name: 'Jane' })
  await queryer[privateMethods].insertData('example', { name: 'Jack' })

  killDatabase(db)
}

export async function dropSeed (logger, database, options) {
  const { db, queryer } = await setupDatabase(logger, database, options)

  // Dropping database
  await queryer[privateMethods].dropDatabase(options.databaseName)

  killDatabase(db)
}
