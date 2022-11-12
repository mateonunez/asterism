const { test } = require('tap')
const { getNanoTime, formatTime, sleep } = require('./../lib/time.js')
const { removeNulls, removeReservedWords } = require('./../lib/normalizers.js')

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

test('normalizers', ({ end }) => {
  test('should remove nulls', async ({ same }) => {
    const obj = { a: null, b: 1 }
    const normalized = removeNulls(obj)
    same(normalized, { a: '', b: 1 })
  })

  test('should remove reserved words', async ({ same }) => {
    const obj = { id: 1, a: 2 }
    const normalized = removeReservedWords(obj)
    same(normalized, { a: 2 })
  })

  end()
})
