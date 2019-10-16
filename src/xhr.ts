import { AxiosRequestConfig, AxiosResponse } from './types'
import { parseResponseHeaders } from './helpers/headers'

export default function xhr(config: AxiosRequestConfig): Promise<AxiosResponse> {
  return new Promise<AxiosResponse>((resolve, reject) => {
    const { url, method = 'get', data = null, headers, responseType, timeout } = config

    const request = new XMLHttpRequest()
    if (responseType) {
      request.responseType = responseType
    }
    if(timeout){
      request.timeout = timeout
    }

    request.open(method.toUpperCase(), url, true)
    // 配置响应对象
    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) {
        return
      }
      if (request.status ===0){
        return
      }
      const responseData = responseType !== 'text' ? request.response : request.responseText
      const responseHeaders = parseResponseHeaders(request.getAllResponseHeaders())
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      handleResponse(response)
    }
    // 处理错误信息
    request.onerror = function handleError(){
      reject(new Error('Network Error!'))
    }
    // 处理超时
    request.ontimeout = function handleTimeout(){
      reject(new Error(`Timeout of ${timeout} ms exceeded`))
    }

    // 放置头部Headers
    Object.keys(headers).forEach((name) => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })
    request.send(data)

    function handleResponse(response: AxiosResponse): void {
      if(response.status>=200 && response.status <300){
        resolve(response)
      }else {
        reject(new Error(`Request failed with status code ${response.status}`))
      }
    }
  })
}
