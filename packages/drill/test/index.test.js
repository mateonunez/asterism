import { test, beforeEach, afterEach } from 'tap'
import setupDatabase, { killDatabase, resolveTables, resolveData } from '../drill.js'
import { database, logger } from '@mateonunez/asterism-huston'
import symbols from '../lib/symbols.js'
import { allowedDatabases } from '../lib/database.js'

const { privateMethods } = symbols
const { mysqlOptions, postgresOptions } = database

let dbMysql, queryerMysql
let dbPostgres, queryerPostgres

beforeEach(async () => {
  const { db: _dbMysql, queryer: _queryerMysql } = await setupDatabase(logger, 'mysql', mysqlOptions)
  dbMysql = _dbMysql
  queryerMysql = _queryerMysql

  const { db: _dbPostgres, queryer: _queryerPostgres } = await setupDatabase(logger, 'postgres', postgresOptions)
  dbPostgres = _dbPostgres
  queryerPostgres = _queryerPostgres
})

afterEach(async () => {
  queryerMysql[privateMethods].dropDatabase(mysqlOptions.databaseName)
  queryerPostgres[privateMethods].dropDatabase(postgresOptions.databaseName)
  await killDatabase(dbMysql)
  await killDatabase(dbPostgres)
})

function getObjects (database) {
  return database === 'mysql' ? { db: dbMysql, queryer: queryerMysql } : database === 'postgres' ? { db: dbPostgres, queryer: queryerPostgres } : {}
}

function getOptions (database) {
  return database === 'mysql' ? mysqlOptions : database === 'postgres' ? postgresOptions : {}
}

test('the database should setup correctly', async ({ end }) => {
  allowedDatabases.forEach((supportedDatabase) => {
    test(supportedDatabase, async ({ ok }) => {
      const { db, queryer } = getObjects(supportedDatabase)
      ok(db)
      ok(queryer)
    })
  })

  end()
})

test('should resolve all the tables', ({ end }) => {
  allowedDatabases.forEach((supportedDatabase) => {
    test(supportedDatabase, async ({ same }) => {
      const { queryer } = getObjects(supportedDatabase)
      const tables = await resolveTables(logger, queryer, getOptions(supportedDatabase))

      same(tables, ['test'])
    })
  })

  end()
})

test('should resolve single table', ({ end }) => {
  allowedDatabases.forEach((supportedDatabase) => {
    test(supportedDatabase, async ({ same, teardown }) => {
      const { queryer } = getObjects(supportedDatabase)
      await queryer[privateMethods].createTable('users', {
        id: {
          type: 'int',
          primaryKey: true
        }
      })

      const tables = await resolveTables(logger, queryer, { ...getOptions(supportedDatabase), tableName: 'users' })
      await queryer[privateMethods].dropTable('users')

      same(tables, ['users'])
    })
  })

  end()
})

test('should resolve single table even if it not exists', ({ end }) => {
  allowedDatabases.forEach((supportedDatabase) => {
    test(supportedDatabase, async ({ same, teardown }) => {
      const { queryer } = getObjects(supportedDatabase)

      const tables = await resolveTables(logger, queryer, { ...getOptions(supportedDatabase), tableName: 'users' })

      same(tables, [null])
    })
  })

  end()
})

test('should resolve data', ({ end }) => {
  allowedDatabases.forEach((supportedDatabase) => {
    test(supportedDatabase, async ({ same }) => {
      const { queryer } = getObjects(supportedDatabase)
      await queryer[privateMethods].createTable('users', {
        name: {
          type: 'varchar',
          length: 255
        }
      }, { dropIfExists: true })

      await queryer[privateMethods].insertData('users', { name: 'John' })

      const tables = await resolveTables(logger, queryer, { ...getOptions(supportedDatabase), tableName: 'users' })
      const data = await resolveData(logger, queryer, tables, { ...getOptions(supportedDatabase), tableName: 'users' })

      await queryer[privateMethods].dropTable('users')

      same(data, {
        users: [{
          name: 'John'
        }]
      })
    })
  })

  end()
})
