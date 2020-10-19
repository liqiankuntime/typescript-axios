import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { type } from 'os'
import { parseHeaders, createError, isURLSameOrigin, cookie, isFormData } from '../helpers'
/**
 * 1、创建 xhr实例
 * 2、执行xhr相关方法，并添加属性
 * 3、事件的监听
 * @param config
 */
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
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress
    } = config

    const request = new XMLHttpRequest()
    // if (responseType) {
    //   request.responseType = responseType
    // }
    // if (timeout) {
    //   request.timeout = timeout
    // }
    // if (withCredentials) {
    //   request.withCredentials = withCredentials
    // }
    console.log('tyeeeP:', request.responseType, responseType, responseType !== 'text')
    request.open(method.toLocaleUpperCase(), url!, true)
    configureRequest()
    addEvents()
    progressHeaders()
    progressCancel()

    request.send(data)

    function configureRequest(): void {
      if (responseType) {
        request.responseType = responseType
      }
      if (timeout) {
        request.timeout = timeout
      }
      if (withCredentials) {
        request.withCredentials = withCredentials
      }
    }
    function addEvents(): void {
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
      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }
      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    function progressHeaders(): void {
      if (isFormData(data)) {
        delete headers['Content-Type']
      }
      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        // ! 不为空的断言
        const xsrfValue = cookie.read(xsrfCookieName)
        if (xsrfValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfValue
        }
      }

      Object.keys(headers).forEach(typeName => {
        if (!data && typeName.toLocaleLowerCase() === 'content-type') {
          Reflect.deleteProperty(headers, typeName)
        } else {
          request.setRequestHeader(typeName, headers[typeName])
        }
      })
    }
    function progressCancel(): void {
      // 取消请求
      if (cancelToken) {
        cancelToken.promise.then(reson => {
          request.abort()
          reject(reson)
        })
      }
    }
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
