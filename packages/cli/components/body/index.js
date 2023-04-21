const blessed = require('blessed')

function Body (screen, options, callback) {
 const bodyBox = blessed.box({
    top: 7,
    left: 0,
    width: '100%',
    height: '100%-7',
    label: 'Data Sources',
    content: 'Ciao piccoli fiorellini della foresta incantata',
    align: 'center',
    valign: 'middle',
    tags: true,
    border: {
      type: 'line'
    },
    ...options
  })

  if (callback) {
    callback(bodyBox)
  }

  return bodyBox
} 

function DataSource (screen, options, callback) {
  const dataSourceBox = Body(screen, {
    label: 'Data Source',
    content: 'Data Source content',
    ...options
  }, callback)

  return dataSourceBox
}

function Help (screen, options, callback) {
 const helpBox = Body(screen, {
    label: 'Help',
    content: 'Help content',
    ...options
  }, callback)

  return helpBox
}

function renderBody (screen) {
  const dataSource = DataSource(screen)
  screen.append(dataSource)

  screen.on(['help'], () => {
    const helpComponent = Help(screen)
    // Remove the Body component and append the Help component
    screen.remove(dataSource)
    screen.append(helpComponent)

    screen.render()
  })
}

module.exports = renderBody
