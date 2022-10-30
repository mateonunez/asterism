export default async function (logger, db, sql) {
  let queryer = {}

  if (db.isMysql) {
    queryer = (await import('./mysql.js')).default(logger, db, sql)
  }

  return queryer
}
