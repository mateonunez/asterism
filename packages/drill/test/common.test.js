import { test } from 'tap'
import setupDatabase, { killDatabase } from './../drill.js'
import symbols from '../lib/symbols.js'
import { logger, database } from '@mateonunez/asterism-huston'
import { allowedDatabases } from '../lib/database.js'

const { mysqlOptions, postgresOptions } = database
const { privateMethods } = symbols

async function createTable (queryer, tableName) {
  await queryer[privateMethods].createTable(tableName, {
    id: {
      type: 'int',
      primaryKey: true
    },
    name: {
      type: 'varchar',
      length: 255
    }
  }, { dropIfExists: true })
}

async function insertIntoTable (queryer, tableName) {
  await queryer[privateMethods].insertData(tableName, {
    id: 1,
    name: 'test'
  })
}

function getOptions (database) {
  return database === 'mysql' ? mysqlOptions : database === 'postgres' ? postgresOptions : {}
}

test('should drop a database', ({ end }) => {
  allowedDatabases.forEach((supportedDatabase) => {
    test(supportedDatabase, async ({ equal, teardown }) => {
      teardown(async () => {
        await killDatabase(db)
      })

      const databaseName = 'test'

      const { db, queryer } = await setupDatabase(logger, supportedDatabase, getOptions(supportedDatabase))
      await queryer[privateMethods].createDatabase('test', { dropIfExists: true })
      await queryer[privateMethods].dropDatabase(databaseName)

      equal(await queryer[privateMethods].databaseExists(databaseName), false)
    })
  })
  end()
})

test('should create a new table', ({ end }) => {
  allowedDatabases.forEach((supportedDatabase) => {
    test(supportedDatabase, async ({ same, teardown }) => {
      teardown(async () => {
        await queryer[privateMethods].dropTable(tableName)
        await queryer[privateMethods].dropDatabase('test')
        await killDatabase(db)
      })
      const { db, queryer } = await setupDatabase(logger, supportedDatabase, {
        ...getOptions(supportedDatabase),
        database: 'test'
      })
      await queryer[privateMethods].createDatabase('test', { dropIfExists: true })
      const tableName = 'common_table_test'
      await createTable(queryer, tableName)
      const data = await queryer.selectData(tableName)

      same(data, [])
    })
  })

  end()
})

test('should insert data into a table', ({ end }) => {
  allowedDatabases.forEach((supportedDatabase) => {
    test(supportedDatabase, async ({ same, teardown }) => {
      teardown(async () => {
        await queryer[privateMethods].dropTable(tableName)
        await killDatabase(db)
      })

      const { db, queryer } = await setupDatabase(logger, supportedDatabase, getOptions(supportedDatabase))
      const tableName = 'common_table_test'
      await createTable(queryer, tableName)
      await insertIntoTable(queryer, tableName)
      const data = await queryer.selectData(tableName)

      same(data, [{
        id: 1,
        name: 'test'
      }])
    })
  })

  end()
})

test('should delete data', ({ end }) => {
  allowedDatabases.forEach((supportedDatabase) => {
    test(supportedDatabase, async ({ same, teardown }) => {
      teardown(async () => {
        await queryer[privateMethods].dropTable(tableName)
        await killDatabase(db)
      })

      const { db, queryer } = await setupDatabase(logger, supportedDatabase, getOptions(supportedDatabase))
      const tableName = 'common_table_test'
      await createTable(queryer, tableName)
      await insertIntoTable(queryer, tableName)
      await queryer[privateMethods].deleteData(tableName, { id: 1 })
      const data = await queryer.selectData(tableName)

      same(data, [])
    })
  })

  end()
})

test('should update data', ({ end }) => {
  allowedDatabases.forEach((supportedDatabase) => {
    test(supportedDatabase, async ({ same, teardown }) => {
      teardown(async () => {
        await queryer[privateMethods].dropTable(tableName)
        await killDatabase(db)
      })

      const { db, queryer } = await setupDatabase(logger, supportedDatabase, getOptions(supportedDatabase))
      const tableName = 'common_table_test'
      await createTable(queryer, tableName)
      await insertIntoTable(queryer, tableName)
      await queryer[privateMethods].updateData(tableName, { name: 'test2' }, { id: 1 })
      const data = await queryer.selectData(tableName)

      same(data, [{
        id: 1,
        name: 'test2'
      }])
    })
  })

  end()
})
