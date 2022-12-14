# ✨ Asterism

Asterism is a CLI that provides a set of tools to build a [Lyra](https://github.com/lyrasearch/lyra) instance from your favorite database.

[![Tests](https://github.com/mateonunez/asterism/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/mateonunez/asterism/actions/workflows/ci.yml)

## Installation

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
Usage: asterism [options] [command]

Asterism CLI

Options:
  -v, --version                 output the current version
  -h, --help                    display help for command

Commands:
  migrate [options] [database]  Initialize a new Lyra instance from your
                                current database
  search [options] [term]       Search for a Lyra instance in your instances
  help [command]                display help for command
```

### Migrate

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
  -p, --port <port>                  Port to run the server on (default: "3306")
  -d, --databaseName <databaseName>  Database connection string
  -t, --tableName <tableName>        Table name
  -u, --user <user>                  Database user (default: "root")
  -w, --password <password>          Database password (default: "toor")
  -o, --outputDir <outputDir>        Output directory (default: "./out")
  -s, --strict <strict>              Strict mode (default: "false")
  --help                             display help for command
```

The CLI provides a `migrate` command that can be used to generate a Lyra instance from a database. The command can be used as follows:

```bash
> asterism migrate
```

### Search

```bash
asterism search --help
```

```bash
Usage: asterism search [options] [term]

Search for a Lyra instance in your instances

Arguments:
  term                          The term to search for

Options:
  -c, --cacheEnabled            Use cache
  -i, --inputDir <inputDir>     Lyra databases directory (default: "./lyra")
  -o, --outputDir <outputDir>   Output directory to save results in a JSON
                                (default: "./out")
  -h, --help                    display help for command
```

The CLI provides a `search` command that can be used to search a term in your instances. The command can be used as follows:

```bash
> asterism search "john"
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
