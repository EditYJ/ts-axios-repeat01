import {isPlainObject} from './utils'

export function transformRequest(data: any):any {
  if(isPlainObject(data)){
    return JSON.stringify(data)
  }
  return data
}

export function parseResponseData(val: any): any {
  if(typeof val === 'string'){
    try {
      val = JSON.parse(val)
    }catch (e) {
      // do nothing
    }
  }
  return val
}
