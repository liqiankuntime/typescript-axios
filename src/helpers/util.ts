export function isDate(val: any): val is Date {
  return Object.prototype.toString.call(val) === '[object Date]'
}

export function isObject(val: any): val is Object {
  return val != null && typeof val === 'object'
}
/**
 * 判断是不是普通的{}对象
 */
export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}
