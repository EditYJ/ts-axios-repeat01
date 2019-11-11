import { AxiosRequestConfig } from '../types';
import { isPlainObject, deepMerage } from '../helpers/utils';


const strats = Object.create(null)

function defaultStrat(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

function fromVal2Strat(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}

function deepMerageStrat(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerage(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerage(val1)
  } else if (typeof val1 !== 'undefined') {
    return val1
  }
}

// 对于这些key采取fromVal2Strat合并策略，只要有就取用户定义的val2
const stratKeysFromVal2 = ['url', 'params', 'data']

stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})

const stratKeysDeepMerage = ['headers', 'auth']

stratKeysDeepMerage.forEach(key => {
  strats[key] = deepMerageStrat
});


export default function mergeConfig(config1: AxiosRequestConfig, config2?: AxiosRequestConfig): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }

  const config = Object.create(null)

  for (let key in config2) {
    merageFiled(key)
  }

  for (let key in config1) {
    if (!config2[key]) {
      merageFiled(key)
    }
  }

  // 根据key找到对应的合并策略函数进行合并操作
  function merageFiled(key: string) {
    const strat = strats[key] || defaultStrat
    config[key] = strat(config1[key], config2![key])
  }

  return config
}