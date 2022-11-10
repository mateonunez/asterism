import { test, beforeEach, afterEach } from 'tap'
import setupDatabase, { killDatabase, resolveTables, resolveData } from '../drill.js'
import huston from '@asterism/huston'
import logger from './helpers/logger.js'

const { mysqlOptions, postgresOptions } = huston

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
  await killDatabase(dbMysql)
  await killDatabase(dbPostgres)
})

test('the database should setup correctly', async ({ end }) => {
  test('mysql', async ({ ok }) => {
    ok(dbMysql)
    ok(queryerMysql)
  })

  test('postgres', async ({ ok }) => {
    ok(dbPostgres)
    ok(queryerPostgres)
  })

  end()
})

test('should resolve all the tables', ({ end }) => {
  test('mysql', async ({ ok }) => {
    const tables = await resolveTables(logger, queryerMysql, mysqlOptions)

    ok(tables)
  })

  test('postgres', async ({ ok }) => {
    const tables = await resolveTables(logger, queryerPostgres, postgresOptions)

    ok(tables)
  })

  end()
})

test('should resolve single table', ({ end }) => {
  test('mysql', async ({ ok }) => {
    const tables = await resolveTables(logger, queryerMysql, { mysqlOptions, tableName: 'users' })

    ok(tables)
  })

  test('postgres', async ({ ok }) => {
    const tables = await resolveTables(logger, queryerPostgres, { ...postgresOptions, tableName: 'users' })

    ok(tables)
  })

  end()
})

test('should resolve data', ({ end }) => {
  test('mysql', async ({ ok }) => {
    const tables = await resolveTables(logger, queryerMysql, mysqlOptions)
    const data = await resolveData(logger, queryerMysql, tables, mysqlOptions)

    ok(data)
  })

  test('postgres', async ({ ok }) => {
    const tables = await resolveTables(logger, queryerPostgres, postgresOptions)
    const data = await resolveData(logger, queryerPostgres, tables, postgresOptions)

    ok(data)
  })

  end()
})
