import { buildUrl, isAbsoluteURL, combineURL, isURLSameOrigin, encode } from '../../src/helpers/url'

describe('helpers:url', () => {
  describe('buildUrl', () => {
    test('should support null params', () => {
      expect(buildUrl('/foo')).toBe('/foo')
    })
    test('should support params', () => {
      expect(buildUrl('/foo', { foo: 'bar' })).toBe('/foo?foo=bar')
    })
    test('should ignore if some param value is null', () => {
      expect(buildUrl('/foo', { foo: 'bar', baz: null })).toBe('/foo?foo=bar')
    })
    test('should ignore if the only param value is null', () => {
      expect(buildUrl('/foo', { baz: null })).toBe('/foo')
    })
    test('should support object params', () => {
      expect(buildUrl('/foo', { foo: { bar: 'baz' } })).toBe(
        '/foo?foo=' + encodeURIComponent('{"bar":"baz"}')
      )
    })
    test('should support date params', () => {
      const date = new Date()
      expect(buildUrl('/foo', { date: date })).toBe('/foo?date=' + encode(date.toISOString()))
    })
    test('should support array params', () => {
      expect(buildUrl('/foo', { foo: ['bar', 'baz'] })).toBe(
        '/foo?' + encode('foo[]') + '=bar&' + encode('foo[]') + '=baz'
      )
    })
    test('should support special char params', () => {
      expect(buildUrl('/foo', { foo: '@:$, ' })).toBe('/foo?foo=' + encode('@:$, '))
    })
    test('should support existing params', () => {
      expect(buildUrl('/foo?foo=bar', { bar: 'baz' })).toBe('/foo?foo=bar&bar=baz')
    })
    test('should correct discard url hash mark', () => {
      expect(buildUrl('/foo?foo=bar#hash', { query: 'baz' })).toBe('/foo?foo=bar&query=baz')
    })
    // 使用jest提供的规则
    test('should use serializer if provided', () => {
      const serializer = jest.fn(() => {
        return 'foo=bar'
      })
      const params = { foo: 'bar' }
      expect(buildUrl('/foo', params, serializer)).toBe('/foo?foo=bar')

      expect(serializer).toHaveBeenCalled()
      expect(serializer).toHaveBeenCalledWith(params)
    })
    test('should support URLSearchParams', () => {
      expect(buildUrl('/foo', new URLSearchParams('bar=baz'))).toBe('/foo?bar=baz')
    })
  })
  describe('isAbsoluteURL', () => {
    test('should return true if URL begins with valid scheme name', () => {
      expect(isAbsoluteURL('https://api.github.com/user')).toBeTruthy()
      expect(isAbsoluteURL('custermer-shemer://example.com/')).toBeTruthy()
      expect(isAbsoluteURL('HTTP://example.com/')).toBeTruthy()
    })
    test('should return false if URL begins with invalid scheme name', () => {
      expect(isAbsoluteURL('123://example.com/')).toBeFalsy()
      expect(isAbsoluteURL('!valid://example.com/')).toBeFalsy()
    })
    test('should return true if URL is protocol-relative', () => {
      expect(isAbsoluteURL('//example.com/')).toBeTruthy()
    })
    test('should return false if URL is relative', () => {
      expect(isAbsoluteURL('/foo')).toBeFalsy()
      expect(isAbsoluteURL('foo')).toBeFalsy()
    })
  })
  describe('combineURL', () => {
    test('should combine url', () => {
      expect(combineURL('https://api.github.com', '/users')).toBe('https://api.github.com/users')
    })
    test('should remove duplicate slashes', () => {
      expect(combineURL('https://api.github.com/', '/users')).toBe('https://api.github.com/users')
    })
    test('should insert missing slash', () => {
      expect(combineURL('https://api.github.com', 'users')).toBe('https://api.github.com/users')
    })

    test('should not insert slash when relative url missing/', () => {
      expect(combineURL('https://api.github.com/users', '')).toBe('https://api.github.com/users')
    })

    test('should allow a single slash for relative url', () => {
      expect(combineURL('https://api.github.com/users', '/')).toBe('https://api.github.com/users/')
    })
  })
  describe('isURLSameOrigin', () => {
    test('should detect same origin', () => {
      expect(isURLSameOrigin(window.location.href)).toBeTruthy()
    })

    test('should detect deffrent origin', () => {
      expect(isURLSameOrigin('https://github.com/axios/axios')).toBeTruthy()
    })
  })
})
