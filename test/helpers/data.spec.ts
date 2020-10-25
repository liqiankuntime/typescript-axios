import { transformRequest, transformResponse } from '../../src/helpers'

describe('helpers:data', () => {
  describe('transformRequest', () => {
    test('should transform request data to string if data is a plainObject', () => {
      const a = { a: 1 }
      expect(transformRequest(a)).toBe('{"a":1}')
    })

    test('should do nothing if data is not a plainObject', () => {
      const a = new URLSearchParams('a=b')
      expect(transformRequest(a)).toBe(a)
    })
  })

  describe('transformResponse', () => {
    test('should transform response data to Object if data is a json string', () => {
      const a = '{"a": 2}'
      expect(transformResponse(a)).toEqual({ a: 2 })
    })

    test('should do nothing if data is a string but not a json string', () => {
      const a = '{a: 2}' // 这个就是一个字符串，不是json字符串·
      expect(transformResponse(a)).toBe('{a: 2}')
    })

    test('should do nothing if data is not a string', () => {
      const a = { a: 1 }
      expect(transformResponse(a)).toBe(a)
    })
  })
})
