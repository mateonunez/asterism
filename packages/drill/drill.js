import { generateConnectionString } from './lib/database.js'
import queries from './lib/queries/index.js'
import { normalizers } from '@mateonunez/asterism-huston'

const { removeNulls, removeReservedWords } = normalizers

export default async function setupDatabase (logger, database, options) {
  if (logger) logger.info(`Setting up ${database} database.`)
  const { db, queryer } = await buildDatabase(logger, database, options)
  return { db, queryer }
}

export async function killDatabase (db) {
  await db.dispose()
}

export async function resolveTables (logger, queryer, options) {
  if (logger) logger.info('Resolving tables.')

  let tables
  if (!options.tableName) {
    tables = await queryer.getTables()
  } else {
    tables = [await queryer.getTable(options.tableName)]
  }
  return tables
}

export async function resolveData (logger, queryer, tables, options) {
  if (logger) logger.info('Resolving tables.')

  const data = {}
  for (const table of tables) {
    data[table] = removeReservedWords(removeNulls(await queryer.selectData(table)))
  }
  return data
}

async function buildDatabase (logger, database, options) {
  const connectionPool = await resolveConnectionPool(logger, database)
  const { sql } = connectionPool
  const { [database]: connectionString } = generateConnectionString(options)
  let db = await connect(logger, connectionPool, database, connectionString)
  db = await resolveMeta(logger, database, db, sql)
  const queryer = await queries(logger, db, sql)
  return { db, sql, queryer }
}

async function resolveConnectionPool (logger, database) {
  if (database === 'mysql') {
    if (logger) logger.info('Importing mysql from @databases/mysql')
    return (await import('@databases/mysql')).default
  } else if (database === 'postgres') {
    if (logger) logger.info('Importing postgres from @databases/postgres')
    return (await import('@databases/pg')).default
  } else {
    throw new Error(`The database "${database}" is not supported.`)
  }
}

async function connect (logger, connectionPool, database, connectionString) {
  if (logger) logger.info(`Connecting to ${database} database at ${connectionString}`)

  let db
  try {
    const options = {
      ...(database === 'postgres' && { bigIntMode: 'string' })
    }
    db = await connectionPool({ connectionString, ...options })
  } catch (error) {
    throw new Error(`Could not connect to ${database} database at ${connectionString}`)
  }
  return db
}

async function resolveMeta (logger, database, db, sql) {
  let version
  let engine

  if (database === 'mysql') {
    version = (await db.query(sql`SELECT VERSION()`))[0]['VERSION()']
    engine = 'mysql'
  } else if (database === 'postgres') {
    version = await db.query(sql`SELECT VERSION()`).version
    engine = 'postgres'
  }

  db.version = version
  const isEngine = `is${engine.charAt(0).toUpperCase()}${engine.slice(1)}`
  db[isEngine] = true

  if (logger) logger.info(`Meta resolved for ${database} database. Version: ${version}, Engine: ${engine}`)
  return db
}
