# @mateonunez/asterism-huston

`asterism-rover` contains all the logic and methods to interact with Lyra and with plugins.

## Exposed methods:

- `generateSchema (logger, data, options)`: Automatic generation of Lyra schemas.
- `generateAsterism (logger, data, schema options)`:  This methods generate a set of Lyra instances and return an Asterism.
- `populateAsterism (logger, asterism, options)`: Persist your Asterism into a separated files.
- `resolveAsterism (logger, options)`: Read a containing Asterism directory and return the memory saved entity.
- `searchOnAsterism (logger, asterism, term, options)` : Accepts an Asterism as parameter and the searched term.

## License

[MIT](/LICENSE)
