import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { type } from 'os'
import { parseHeaders, createError } from '../helpers'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = 'get',
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials
    } = config

    const request = new XMLHttpRequest()
    if (responseType) {
      request.responseType = responseType
    }
    if (timeout) {
      request.timeout = timeout
    }
    if (withCredentials) {
      request.withCredentials = withCredentials
    }
    console.log('tyeeeP:', request.responseType, responseType, responseType !== 'text')
    request.open(method.toLocaleUpperCase(), url!, true)
    request.onreadystatechange = () => {
      if (request.readyState !== 4) {
        return
      }
      if (request.status === 0) {
        return
      }
      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const responseData = responseType !== 'text' ? request.response : request.responseText

      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      handleResponse(response)
    }
    request.onerror = () => {
      reject(createError('Network Error', config, null, request))
    }
    request.ontimeout = () => {
      reject(createError(`timeout of ${timeout} exceeded`, config, '500', request))
    }

    Object.keys(headers).forEach(typeName => {
      if (!data && typeName.toLocaleLowerCase() === 'content-type') {
        Reflect.deleteProperty(headers, typeName)
      } else {
        request.setRequestHeader(typeName, headers[typeName])
      }
    })

    // 取消请求
    if (cancelToken) {
      cancelToken.promise.then(reson => {
        request.abort()
        reject(reson)
      })
    }

    // 为啥下面这个写法不行呢
    // Reflect.ownKeys(headers).forEach((typename)=> {
    //   request.setRequestHeader(typename, headers[typename])
    // })
    request.send(data)

    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(
          createError(
            `request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
