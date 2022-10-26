export function generateConnectionString ({ host, port, user, password, databaseName }) {
  return {
    postgres: `postgres://${user}:${password}@${host}:${port}/${databaseName}`,
    mysql: `mysql://${user}:${password}@${host}:${port}/${databaseName}`,
    sqlite: `sqlite://${databaseName}`
  }
}

export const allowedDatabases = ['mysql', 'postgres', 'sqlite']
