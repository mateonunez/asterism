const defaultOptions = {
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  // deepcode ignore NoHardcodedPasswords/test: example data
  password: 'toor',
  output: './lyra.json'
}

const postgresOptions = {
  ...defaultOptions,
  user: 'postgres',
  port: '5432'
}

export { defaultOptions, postgresOptions }
