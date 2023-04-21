const blessed = require('blessed')
const { config } = require('@mateonunez/asterism-huston')

function TitleAscii (screen, options, callback) {
  const titleAscii = blessed.box({
    content: config.titleAscii,
    left: 0,
    tags: true,
    ...options
  })

  if (callback) {
    callback(titleAscii)
  }

  return titleAscii
}

module.exports = TitleAscii
