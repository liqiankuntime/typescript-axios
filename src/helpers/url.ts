import { isDate, isPlainObject, isURLSearchParams } from './index'

export function encode(val: string): string {
  return encodeURIComponent(val)
    .replace('/%40/g', '@')
    .replace('/%3A/ig', ':')
    .replace('/%24/g', '$')
    .replace('/%2C/ig', ',')
    .replace('/%20/g', '+')
    .replace('/%5B/ig', '[')
    .replace('/%5D/ig', ']')
}

interface URLOrigin {
  protocol: string
  host: string
}
export function buildUrl(
  url: string,
  params?: any,
  paramsSerializer?: (param: any) => string
): string {
  if (!params) return url
  let serializeParams
  if (paramsSerializer) {
    serializeParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializeParams = params.toString()
  } else {
    const parts: string[] = []

    Object.keys(params).forEach(key => {
      const val = params[key]
      if (val === null || typeof val === 'undefined') {
        return
      }
      let values = []
      if (Array.isArray(val)) {
        values = val
        key += '[]'
      } else {
        values = [val]
      }
      values.forEach(val => {
        if (isDate(val)) {
          val = val.toISOString()
        } else if (isPlainObject(val)) {
          val = JSON.stringify(val)
        }
        parts.push(`${encode(key)}=${encode(val)}`)
      })
    })
    serializeParams = parts.join('&')
  }
  if (serializeParams) {
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializeParams
  }

  return url
}

export function isAbsoluteURL(url: string): boolean {
  // 字母开头 后面跟的是[字母]或[数字]或[+号]或[-号]或[.]
  // https://org.modao.cc/
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineURL(baseURL: string, relativeURL?: string): string {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}

export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolceURL(requestURL)
  return (
    parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
  )
}

const urlParsingNode = document.createElement('a')
// <a></a>
const currentOrigin = resolceURL(window.location.href)

function resolceURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('hres', url)
  // <a href="https://new.qq.com/omn/20201015/20201015A0DFHN00.html"></a>
  let { protocol, host } = urlParsingNode
  // protocol: https
  // host: new.qq.com
  return {
    protocol, // 协议
    host // 域名
  }
}
