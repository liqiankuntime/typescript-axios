import { AxiosRequestConfig } from './types'

const defaults: AxiosRequestConfig = {
  method: 'get',

  timeout: 0,
  headers: {
    common: {
      Accept: 'Application/json, text/plain, */*'
    }
  }
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
