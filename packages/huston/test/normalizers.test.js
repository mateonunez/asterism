const test = require('node:test')
const assert = require('node:assert')
const { removeNulls, removeReservedWords } = require('./../lib/normalizers.js')

test.describe('normalizers', () => {
  test('should remove nulls', () => {
    const object = { a: null, b: 1 }
    const normalized = removeNulls(object)
    assert.deepStrictEqual(normalized, { a: '', b: 1 })
  })

  test('should remove reserved words', () => {
    const object = { id: 1, a: 2 }
    const normalized = removeReservedWords(object)
    assert.deepStrictEqual(normalized, { a: 2 })
  })

  test('should remove nulls in arrays', () => {
    const array = [null, 1, { a: null, b: 2 }, [null, 3]]
    const normalized = removeNulls(array)
    assert.deepStrictEqual(normalized, ['', 1, { a: '', b: 2 }, ['', 3]])
  })

  test('should remove reserved words in arrays', () => {
    const arr = [{ id: 1, a: 2 }, [{ id: 3, b: 4 }]]
    const normalized = removeReservedWords(arr)
    assert.deepStrictEqual(normalized, [{ a: 2 }, [{ b: 4 }]])
  })

  test('should remove nulls in nested objects', () => {
    const object = { a: { c: null, d: 2 }, b: [null, 3] }
    const normalized = removeNulls(object)
    assert.deepStrictEqual(normalized, { a: { c: '', d: 2 }, b: ['', 3] })
  })

  test('should remove reserved words in nested objects', () => {
    const object = { a: { id: 1, c: 2 }, b: [{ id: 3, d: 4 }] }
    const normalized = removeReservedWords(object)
    assert.deepStrictEqual(normalized, { a: { c: 2 }, b: [{ d: 4 }] })
  })
})
