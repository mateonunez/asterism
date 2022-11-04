import common from './common.js'

export default async function (logger, db, sql) {
  return {
    ...(await common(logger, db, sql)),
  }
}
