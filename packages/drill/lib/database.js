export function generateConnectionString ({ host, port, user, password, databaseName }) {
  return {
    /* c8 ignore next 2 */
    postgres: `postgres://${user}:${encodeURIComponent(password)}@${host}:${port}${databaseName ? `/${databaseName}` : '/db'}`,
    mysql: `mysql://${user}:${encodeURIComponent(password)}@${host}:${port}${databaseName ? `/${databaseName}` : '/db'}`
  }
}

export const allowedDatabases = ['mysql', 'postgres']
