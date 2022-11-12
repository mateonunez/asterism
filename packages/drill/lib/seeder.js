import setupDatabase, { killDatabase } from '../drill.js'
import symbols from './symbols.js'

const { privateMethods } = symbols

export default async function (logger, database, options) {
  const { db, queryer } = await setupDatabase(logger, database, options)
  await queryer[privateMethods].createDatabase('drill', { dropIfExists: true })
  const tableName = 'seeder_example'
  await queryer[privateMethods].createTable(tableName, {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: 'varchar',
      length: 255
    }
  }, { dropIfExists: true })

  await queryer[privateMethods].insertData(tableName, { name: 'John' })
  await queryer[privateMethods].insertData(tableName, { name: 'Jane' })
  await queryer[privateMethods].insertData(tableName, { name: 'Jack' })

  killDatabase(db)
}

export async function dropSeed (logger, database, options) {
  const { db, queryer } = await setupDatabase(logger, database, options)

  // Dropping database
  await queryer[privateMethods].dropDatabase(options.databaseName)

  killDatabase(db)
}
