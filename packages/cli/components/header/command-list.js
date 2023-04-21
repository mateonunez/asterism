const blessed = require('blessed')

const MENU_ITEMS = {
  datasources: 1,
  search: 2,
  help: 3,
  exit: 4
}

function CommandList (screen, options, callback) {
  const commands = [
    '',
    '{bold}{blue-fg}<d>{/blue-fg}{/bold}     Datasources',
    '{bold}{blue-fg}<s>{/blue-fg}{/bold}     Search',
    '{bold}{blue-fg}<h>{/blue-fg}{/bold}     Help',
    '{bold}{blue-fg}<C-c>{/blue-fg}{/bold}   Exit',
  ]

  const commandList = blessed.list({
    left: '80%',
    valign: 'middle',
    tags: true,
    mouse: true,
    keys: true,
    ...options
  })

  for (const command of commands) {
    commandList.addItem(command)
  }

  if (callback) {
    callback(commandList)
  }

  commandList.on('select', (item, index) => {
    if (!screen) {
      throw new Error('Screen is not defined')
      process.exit(1)
    }
    
    switch (index) {
      case MENU_ITEMS.datasources:
        screen.emit('datasources')
        break
      case MENU_ITEMS.search:
        screen.emit('search')
        break
      case MENU_ITEMS.help:
        screen.emit('help')
        break
      case MENU_ITEMS.exit:
        process.exit(0)
        break
      default:
        break
    }
  })

  return commandList
}

module.exports = CommandList
