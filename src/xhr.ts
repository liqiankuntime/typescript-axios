import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import { type } from 'os'
import { parseHeaders } from './helpers'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, url, method = 'get', headers, responseType } = config

    const request = new XMLHttpRequest()
    if (responseType) {
      request.responseType = responseType
    }
    console.log('tyeeeP:', request.responseType, responseType, responseType !== 'text')
    request.open(method.toLocaleUpperCase(), url, true)
    request.onreadystatechange = () => {
      if (request.readyState !== 4) {
        return
      }
      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const responseData = responseType !== 'text' ? request.response : request.responseText
      console.log('parseHeaders:', parseHeaders)
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      resolve(response)
    }

    Object.keys(headers).forEach(typeName => {
      if (!data && typeName.toLocaleLowerCase() === 'content-type') {
        Reflect.deleteProperty(headers, typeName)
      } else {
        request.setRequestHeader(typeName, headers[typeName])
      }
    })
    // 为啥下面这个写法不行呢
    // Reflect.ownKeys(headers).forEach((typename)=> {
    //   request.setRequestHeader(typename, headers[typename])
    // })
    request.send(data)
  })
}
