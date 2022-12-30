'use strict'

function getNanoTime () {
  if (typeof process !== 'undefined' && process.hrtime !== undefined) {
    return process.hrtime.bigint()
  }
  /* c8 ignore next */
  return BigInt(0)
}

function formatTime (time) {
  /* c8 ignore start */
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
  /* c8 ignore stop */
  return `${time / BigInt(1e9)}s`
}

function sleep (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

module.exports = {
  getNanoTime,
  formatTime,
  sleep
}
