const test = require('node:test')
const assert = require('node:assert')
const { getNanoTime, formatTime, sleep } = require('./../lib/time.js')

test.describe('time', () => {
  test.it('should get nano time', async () => {
    const time = getNanoTime()
    assert.equal(typeof time, 'bigint')
  })

  test.it('should format time in nanoseconds', async () => {
    const time = BigInt(123)
    const formattedTime = formatTime(time)
    assert.equal(formattedTime, '123ns')
  })

  test.it('should format time in microseconds', async () => {
    const time = BigInt(123456)
    const formattedTime = formatTime(time)
    assert.equal(formattedTime, '123μs')
  })

  test.it('should format time in milliseconds', async () => {
    const time = BigInt(123456789)
    const formattedTime = formatTime(time)
    assert.equal(formattedTime, '123ms')
  })

  test.it('should format time in seconds', async () => {
    const time = BigInt(1234567890)
    const formattedTime = formatTime(time)
    assert.equal(formattedTime, '1s')
  })

  test.it('should convert number to bigint and format time', async () => {
    const time = 123456789
    const formattedTime = formatTime(time)
    assert.equal(formattedTime, '123ms')
  })

  test.it('should throw error for negative time', async () => {
    const time = BigInt(-123)
    assert.throws(() => formatTime(time), /microtime must be positive/)
  })

  test.it('should sleep for 100ms', async () => {
    const start = getNanoTime()
    await sleep(100)
    const end = getNanoTime()
    const elapsed = end - start
    assert.equal(elapsed >= BigInt(1e8), true)
  })

  test.it('should return BigInt(0) if process or process.hrtime is undefined', () => {
    const originalHrtime = process.hrtime

    Object.defineProperty(process, 'hrtime', {
      value: undefined,
      writable: true
    })

    let time = getNanoTime()
    assert.equal(time, BigInt(0))

    process.hrtime = originalHrtime

    time = getNanoTime()
    assert.ok(typeof time === 'bigint')
    assert.ok(time > BigInt(0))
  })
})
