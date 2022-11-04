import setupDatabase, { killDatabase } from '../drill.js'
import symbols from './symbols.js'

export default async function (logger, database, options) {
  const { db, queryer } = await setupDatabase(logger, database, options)

  // Creating database
  await queryer[symbols.privateMethods].createDatabase(options.databaseName)

  await queryer[symbols.privateMethods].createTable('example', {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: 'string',
      length: 255
    }
  })

  await queryer.insertData('example', { name: 'John' })
  await queryer.insertData('example', { name: 'Jane' })
  await queryer.insertData('example', { name: 'Jack' })

  const response = await queryer.selectData('example', ['id', 'name'], { name: 'Jane' })

  console.log(response)

  killDatabase(db)
}
