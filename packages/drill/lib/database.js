export function generateConnectionString ({ host, port, user, password, databaseName }) {
  return {
    postgres: `postgres://${user}:${encodeURIComponent(password)}@${host}:${port}`,
    mysql: `mysql://${user}:${encodeURIComponent(password)}@${host}:${port}`,
    sqlite: `sqlite://${databaseName}`
  }
}

export const allowedDatabases = ['mysql', 'postgres', 'sqlite']
