export function generateConnectionString ({ host, port, user, password, databaseName }) {
  return {
    postgres: `postgres://${user}:${encodeURIComponent(password)}@${host}:${port}/${databaseName}`,
    mysql: `mysql://${user}:${encodeURIComponent(password)}@${host}:${port}/${databaseName}`,
    sqlite: `sqlite://${databaseName}`
  }
}

export const allowedDatabases = ['mysql', 'postgres', 'sqlite']
