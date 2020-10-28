import { AxiosRequestConfig } from '../types'
import { isPlainObject, deepMerge } from '../helpers'
let strats = Object.create(null)

function defaultStrat(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}
function fromVal2Strat(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' && val2
}

function deepMergeStract(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else if (typeof val1 !== 'undefined') {
    return val1
  }
}

const stratKeysFromVal2 = ['url', 'param', 'data']
stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})

const stratKeysDeepMerge = ['headers', 'auth']
stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStract
})

export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }
  const config = Object.create(null)
  for (let key in config2) {
    mergeField(key)
  }

  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    const strat = strats[key] || defaultStrat
    config[key] = strat(config1[key], config2[key]) // !类型断言这里的config2一定不会为空
  }

  return config
}
