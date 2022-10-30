'use strict'

function getNanoTime () {
  if (typeof process !== 'undefined' && process.hrtime !== undefined) {
    return process.hrtime.bigint()
  }

  return BigInt(0)
}

function formatTime (time) {
  if (typeof time === 'number') {
    time = BigInt(time)
  }

  if (time < 0n) {
    throw new Error('microtime must be positive')
  } else if (time < BigInt(1e3)) {
    return `${time}ns`
  } else if (time < BigInt(1e6)) {
    return `${time / BigInt(1e6)}μs`
  } else if (time < BigInt(1e9)) {
    return `${time / BigInt(1e6)}ms`
  }

  return `${time / 1e9}s`
}

module.exports = {
  getNanoTime,
  formatTime
}
