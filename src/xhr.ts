import { AxiosRequestConfig, AxiosResponse } from './types'

export default function xhr(config: AxiosRequestConfig): Promise<AxiosResponse> {
  return new Promise<AxiosResponse>((resolve, reject) => {
    const { url, method = 'get', data = null, headers, responseType } = config

    const request = new XMLHttpRequest()
    if (responseType) {
      request.responseType = responseType
    }
    request.open(method.toUpperCase(), url, true)
    // 配置响应对象
    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) {
        return
      }
      const responseData = responseType !== 'text' ? request.response : request.responseText
      const responseHeaders = request.getAllResponseHeaders()
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      resolve(response)
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
  })
}
