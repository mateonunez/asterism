import blessed from 'blessed'
import { config } from '@mateonunez/asterism-huston'
import renderHeader from '../components/header/index.js'
import renderBody from '../components/body/index.js'

function TUI () {
  const screen = blessed.screen({
    title: config.title,
    keys: true,
    vi: true,
    fullUnicode: true,
    dockBorders: true,
    smartCSR: true,
  })

  renderHeader(screen)
  renderBody(screen)

  return screen
}

export default TUI
