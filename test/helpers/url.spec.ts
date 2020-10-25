import { buildUrl, isAbsoluteURL, combineURL, isURLSameOrigin } from '../../src/helpers/url'

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
        '/foo?foo=' + encodeURI('{"bar": baz}')
      )
    })
    test('should support date params', () => {
      const date = new Date()
      expect(buildUrl('/foo', { date: date })).toBe('/foo?date=' + date.toISOString())
    })
    test('should support array params', () => {
      expect(buildUrl('/foo', { foo: ['bar', 'baz'] })).toBe('/foo?foo[]=bar&foo[]=baz')
    })
    test('should support special char params', () => {
      expect(buildUrl('/foo', { foo: '@:$, ' })).toBe('/foo?foo=@:$,+')
    })
    test('should support existing params', () => {
      expect(buildUrl('/foo?foo=bar', { bar: 'baz' })).toBe('/foo?foo=bar&baz=bar')
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
      expect(serializer).toHaveBeenCalledWith()
    })
    test('should support URLSearchParams', () => {
      expect(buildUrl('/foo', new URLSearchParams('bar=baz'))).toBe('/foo?bar=baz')
    })
  })
  describe('isAbsoluteURL', () => {})
  describe('combineURL', () => {})
  describe('isURLSameOrigin', () => {})
})
