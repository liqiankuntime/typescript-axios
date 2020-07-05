import { isPlainObject } from './util'
import { head } from 'shelljs'

/**
 * 规范header里的属性为 横线驼峰写法
 * @param headers
 * @param normalizedName
 */
function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) {
    return
  }
  Object.keys(headers).forEach(item => {
    if (item !== normalizedName && item.toLocaleUpperCase() === normalizedName) {
      headers[normalizedName] = headers[item]
      Reflect.deleteProperty(headers, item)
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')
  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=UTF-8'
    }
  }
  return headers
}

export function parseHeaders(headers: string): any {
  let parsed = Object.create(null)
  if (!headers) {
    return parsed
  }
  headers.split('\r\n').forEach(line => {
    let [key, val] = line.split(':')
    key = key.trim().toLocaleLowerCase()
    if (!key) {
      return // 进行下一个循环
    }
    if (val) {
      val = val.trim().toLocaleLowerCase()
    }
    parsed[key] = val
  })
  return parsed
}
