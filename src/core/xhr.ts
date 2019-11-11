import { createError } from '../helpers/error';
import { parseResponseHeaders } from '../helpers/headers';
import { AxiosRequestConfig, AxiosResponse } from '../types';
import { isURLSameOrigin } from '../helpers/url';
import cookie from '../helpers/cookie';

export default function xhr(config: AxiosRequestConfig): Promise<AxiosResponse> {
  return new Promise<AxiosResponse>((resolve, reject) => {
    const {
      url,
      method = 'get',
      data = null,
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName
    } = config

    const request = new XMLHttpRequest()
    if (responseType) {
      request.responseType = responseType
    }
    if (timeout) {
      request.timeout = timeout
    }
    if (withCredentials) {
      request.withCredentials = withCredentials
    }

    request.open(method.toUpperCase(), url!, true)
    // 配置响应对象
    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) {
        return
      }
      if (request.status === 0) {
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
    request.onerror = function handleError() {
      reject(createError(
        'Network Error',
        config,
        null,
        request
      ))
    }
    // 处理超时
    request.ontimeout = function handleTimeout() {
      reject(createError(
        `Timeout of ${timeout} ms exceeded`,
        config,
        'ECONNABORTED',
        request
      ))
    }

    if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
      const xsrfValue = cookie.read(xsrfCookieName)
      if (xsrfValue && xsrfHeaderName) {
        headers[xsrfHeaderName] = xsrfValue
      }
    }

    // 放置头部Headers
    Object.keys(headers).forEach((name) => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    // 取消请求的代码逻辑
    if (cancelToken) {
      // tslint:disable-next-line: no-floating-promises
      cancelToken.promise.then(reason => {
        request.abort()
        reject(reason)
      })
    }

    request.send(data)

    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(createError(
          `Request failed with status code ${response.status}`,
          config,
          null,
          request,
          response
        ))
      }
    }
  })
}
