import { AxiosRequestConfig } from './types'
import { processHeaders, transformRequest, transformResponse } from './helpers'

const defaults: AxiosRequestConfig = {
  method: 'get',

  timeout: 0,
  headers: {
    common: {
      Accept: 'Application/json, text/plain, */*'
    }
  },
  transformRequest: [
    function(data: any, headers: any): any {
      processHeaders(headers, data)
      return transformRequest(data)
    }
  ],
  transformResponse: [
    function(data: any): any {
      return transformResponse(data)
    }
  ]
}

const MethodNoData = ['delete', 'get', 'head', 'options']
MethodNoData.forEach(method => {
  defaults.headers[method] = {}
})

const MethodWithData = ['post', 'put', 'patch']
MethodWithData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencode'
  }
})

export default defaults
