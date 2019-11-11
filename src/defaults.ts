import { parseResponseData, transformRequest } from './helpers/data';
import { processHeaders } from './helpers/headers';
import { AxiosRequestConfig } from './types';

const defaults: AxiosRequestConfig = {
  method: 'get',
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  // transformRequest, transformResponse采用默认的合并策略，优先使用自定义策略覆盖掉默认策略
  transformRequest: [
    function (data: any, headers: any): any {
      processHeaders(headers, data)
      return transformRequest(data)
    }
  ],
  transformResponse: [
    function (data: any): any {
      return parseResponseData(data)
    }
  ]
}

const methodsNodata = ['delete', 'get', 'head', 'options']

methodsNodata.forEach(method => {
  defaults.headers[method] = {}
})

const methodsWithData = ['post', 'put', 'patch']

methodsWithData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export default defaults
