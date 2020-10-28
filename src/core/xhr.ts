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
      onUploadProgress,
      auth,
      validateStatus
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
    // 调用 open()方法并不会真正发送请求， 而只是启动一个请求以备发送。[红宝书]
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
        request.timeout = timeout // 设置过期的时间属性
      }
      if (withCredentials) {
        request.withCredentials = withCredentials
      }
    }
    function addEvents(): void {
      // 不过，必须在调用 open()之前指定 onreadystatechange 事件处理程序
      // 才能确保跨浏览器兼容性【红宝书】
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
      // 请求终止时，会调用 ontimeout 事件处理程序；配合timeout属性使用
      // xhr的取消对比Promise.race()方法的取消 const p = Promise.race([
      //   fetch('/resource-that-may-take-a-while'),
      //   new Promise(function (resolve, reject) {
      //     setTimeout(() => reject(new Error('request timeout')), 5000)
      //   })
      // ]);
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

      if (auth) {
        // btoa(string) 用来创建一个 base-64编码的字符串。
        headers['Authorization'] = `Basic ${btoa(auth.username)}:${btoa(auth.password)}` // 'Basic' + btoa(auth.username)
      }

      // 要成功发送请求头部信息，必须在调用 open()方法之后且调用 send()方法 之前
      // 调用 setRequestHeader() 【红宝书】
      Object.keys(headers).forEach(typeName => {
        if (!data && typeName.toLocaleLowerCase() === 'content-type') {
          Reflect.deleteProperty(headers, typeName)
        } else {
          // 这个方法接受两个参数:头部字段 的名称和头部字段的值 【红宝书】
          request.setRequestHeader(typeName, headers[typeName])
        }
      })
    }
    function progressCancel(): void {
      // 取消请求
      if (cancelToken) {
        cancelToken.promise
          .then(reson => {
            request.abort()
            reject(reson)
          })
          .catch(
            /* istanbul ignore next */
            () => {
              // do nothing 忽略单元测试
            }
          )
      }
    }
    function handleResponse(response: AxiosResponse): void {
      // if (response.status >= 200 && response.status < 300) {
      if (!validateStatus || validateStatus(response.status)) {
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
