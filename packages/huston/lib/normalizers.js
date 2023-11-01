'use strict'

function removeNulls (object) {
  if (object === null) return ''
  if (typeof object !== 'object') return object

  if (Array.isArray(object)) {
    return object.map(removeNulls)
  }

  const newObj = {}
  for (const [key, value] of Object.entries(object)) {
    if (value === null) {
      newObj[key] = ''
    } else {
      newObj[key] = removeNulls(value)
    }
  }

  return newObj
}

function removeReservedWords (object) {
  if (typeof object !== 'object') {
    return object
  }

  if (Array.isArray(object)) {
    return object.map(removeReservedWords)
  }

  const newObj = {}
  for (const [key, value] of Object.entries(object)) {
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
