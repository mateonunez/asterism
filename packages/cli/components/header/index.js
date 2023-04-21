const blessed = require('blessed')
const TitleAscii = require('./title-ascii.js')
const CommandList = require('./command-list.js')

function Header (screen, options, callback) {
  const headerBox = blessed.box({
    top: 0,
    left: 0,
    width: '100%',
    height: 9,
    ...options
  })

  if (callback) {
    callback(headerBox)
  }

  return headerBox
}

function renderHeader (screen) {
  const headerComponent = Header()
  screen.append(Header(screen))

  // Renders the title ascii
  screen.append(TitleAscii(screen, {
    parent: headerComponent
  }))

  // Renders the command list
  screen.append(CommandList(screen, {
    parent: headerComponent
  }))
}

module.exports = renderHeader
