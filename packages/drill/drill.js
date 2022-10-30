import { generateConnectionString } from './lib/database.js'
import queries from './lib/queries/index.js'

export default async function setupDatabase (logger, database, options) {
  const { db, queryer } = await buildDatabase(logger, database, options)

  return { db, queryer }
}

export async function killDatabase (db) {
  await db.dispose()
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
    logger.info('Importing mysql from @databases/mysql')
    return (await import('@databases/mysql')).default
  } else if (database === 'postgres') {
    logger.info('Importing postgres from @databases/postgres')
    return (await import('@databases/pg')).default
  } else if (database === 'sqlite') {
    logger.info('Importing sqlite from @databases/sqlite')
    return (await import('@databases/sqlite')).default
  } else {
    throw new Error(`The database "${database}" is not supported.`)
  }
}

function connect (logger, connectionPool, database, connectionString) {
  logger.info(`Connecting to ${database} database at ${connectionString}`)

  let db
  try {
    db = connectionPool({
      connectionString
    })
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
    version = await db.query(sql`SELECT VERSION()`)[0][0].version
    engine = 'postgres'
  } else if (database === 'sqlite') {
    version = await db.query(sql`SELECT SQLITE_VERSION()`)[0][0].sqlite_version
    engine = 'sqlite'
  } else {
    throw new Error(`The database "${database}" is not supported.`)
  }

  db.version = version
  const isEngine = `is${engine.charAt(0).toUpperCase()}${engine.slice(1)}`
  db[isEngine] = true

  logger.info(`Meta resolved for ${database} database. Version: ${version}, Engine: ${engine}`)
  return db
}
