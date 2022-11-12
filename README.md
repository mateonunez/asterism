# Asterism

![Image generated by Midjourney](https://user-images.githubusercontent.com/11861080/198077572-4e82aaa6-817b-49ca-bf7b-0c00c8e8dde8.png)

Asterism is a library that provides a set of tools to build a [Lyra](https://github.com/lyrasearch/lyra) instance from your favorite database.

[![Tests](https://github.com/mateonunez/asterism/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/mateonunez/asterism/actions/workflows/ci.yml)

## Installation (not available yet)

You can install the package using `npm`, `yarn` or `pnpm`:

```bash
npm i -g @mateonunez/asterism
```
```bash
yarn add -g @mateonunez/asterism
```
```bash
pnpm add -g @mateonunez/asterism
```

## Usage

Asterism provides a CLI that can be used to generate a Lyra instance from a database. The CLI can be used as follows:

```bash
asterism migrate --help
```

```bash
Usage: asterism migrate [options] [database]

Initialize a new Lyra instance from your current database

Arguments:
  database                           The database to migrate

Options:
  -H, --host <host>                  Database host (default: "127.0.0.1")
  -h, --port <port>                  Port to run the server on (default: "3306")
  -d, --databaseName <databaseName>  Database connection string
  -t, --tableName <tableName>        Table name
  -u, --user <user>                  Database user (default: "root")
  -w, --password <password>          Database password (default: "toor")
  -o, --output <output>              Output directory (default: "./out")
  --help                             display help for command
```

The CLI provides a `migrate` command that can be used to generate a Lyra instance from a database. The command can be used as follows:

```bash
> asterism migrate
```

## Testing

Asterism needs a database to run the tests. At first run the `docker-compose` file.

```bash
docker-compose up -d
```

Then, run the tests using `npm`, `yarn` or `pnpm`:

```bash
npm run test
```

## License

[MIT](/LICENSE)