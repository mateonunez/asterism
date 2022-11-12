const { test } = require('tap')
const { getNanoTime, formatTime, sleep } = require('./../lib/time.js')

test('time', ({ end }) => {
  test('should get nano time', async ({ ok }) => {
    const time = getNanoTime()
    ok(time)
  })

  test('should format time', async ({ ok }) => {
    const time = getNanoTime()
    const formattedTime = formatTime(time)
    ok(formattedTime)
  })

  test('should sleep', async ({ ok }) => {
    await sleep(100)
    ok(true)
  })

  end()
})
