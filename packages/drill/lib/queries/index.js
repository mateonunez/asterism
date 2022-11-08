export default async function (logger, db, sql) {
  let queryer = {}

  if (db.isMysql) {
    queryer = await (await import('./mysql.js')).default(logger, db, sql)
  } else if (db.isPostgres) {
    queryer = (await import('./postgres.js')).default(logger, db, sql)
  }
  return queryer
}
