export function generateConnectionString ({ host, port, user, password, databaseName }) {
  return {
    postgres: `postgres://${user}:${encodeURIComponent(password)}@${host}:${port}${databaseName ? `/${databaseName}` : '/db'}`,
    mysql: `mysql://${user}:${encodeURIComponent(password)}@${host}:${port}${databaseName ? `/${databaseName}` : '/db'}`,
    sqlite: `sqlite://${databaseName ? `/${databaseName}` : './asterism.db'}`
  }
}

export const allowedDatabases = ['mysql', 'postgres', 'sqlite']
