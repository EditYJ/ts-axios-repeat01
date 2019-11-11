import { isDate, isPlainObject } from './utils'

interface URLOrigin {
  protocol: string
  host: string
}

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/ig, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/ig, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/ig, '[')
    .replace(/%5D/ig, ']')
}

export function buildURL(url: string, params?: any): string {
  // 如果参数为空则原样返回
  if (!params) {
    return url
  }

  const parts: string[] = []

  // 遍历 params 得到参数数组列表
  Object.keys(params).forEach((key) => {
    const val = params[key]
    // 如果val不存在没有值 则进入下一次循环
    if (val === null || typeof val === 'undefined') {
      return
    }
    // val有值的情况
    // 判断是不是一个数组
    let values = []
    if (Array.isArray(val)) {
      values = val
      key += '[]'
    } else {
      values = [val]
    }
    // 遍历values判断值的类型做相应的处理
    values.forEach((val) => {
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val)
      }
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })

  // 给参数加上‘&’分隔符
  let serializedParams = parts.join('&')
  // 如果serializedParams不为空
  if (serializedParams) {
    // 判断是否存在哈希参数，如果存在则去除哈希参数
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }
    // 针对已经存在?url参数的情况作出处理
    url += ((url.indexOf('?') === -1) ? '?' : '&') + serializedParams
  }

  return url
}

export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)
  return (parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host)
}

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)

// 解析URL
function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode

  return {
    protocol,
    host
  }
}