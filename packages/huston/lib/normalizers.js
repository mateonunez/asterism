'use strict'

function removeNulls (obj) {
  if (typeof obj !== 'object') {
    return obj
  }

  /* c8 ignore next 3 */
  if (Array.isArray(obj)) {
    return obj.map(removeNulls)
  }

  const newObj = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value === null) {
      newObj[key] = ''
    } else {
      newObj[key] = removeNulls(value)
    }
  }

  return newObj
}

function removeReservedWords (obj) {
  if (typeof obj !== 'object') {
    return obj
  }

  /* c8 ignore next 3 */
  if (Array.isArray(obj)) {
    return obj.map(removeReservedWords)
  }

  const newObj = {}
  for (const [key, value] of Object.entries(obj)) {
    if (key !== 'id') {
      newObj[key] = removeReservedWords(value)
    }
  }

  return newObj
}

module.exports = {
  removeNulls,
  removeReservedWords
}
