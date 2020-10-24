import dispatchRequest, { transforUrl } from './dispatchRequest'
import {
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
  ResolveFn,
  RejectFn
} from '../types'
import InterceptorManager from './interceptorManager'
import mergeConfig from './mergeConfig'
interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

interface IPromiseChain<T> {
  resolved: ResolveFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectFn
}

export default class Axios {
  defaults: AxiosRequestConfig
  interceptors: Interceptors
  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
  }
  request(url?: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      config = url
    }
    config = mergeConfig(this.defaults, config)
    const chain: IPromiseChain<any>[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined
      }
    ]
    // request： 先添加的先执行
    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor)
    })
    // response： 先添加的后执行
    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })
    let promise = Promise.resolve(config)
    while (chain.length) {
      const { resolved, rejected } = chain.shift()! // 断言不为空
      promise = promise.then(resolved, rejected)
    }

    return promise // dispatchRequest(config)
  }
  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.requestMethodWithoutData('get', url, config)
  }
  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.requestMethodWithoutData('delete', url, config)
  }
  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.requestMethodWithoutData('head', url, config)
  }
  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.requestMethodWithoutData('options', url, config)
  }
  requestMethodWithoutData(method: Method, url: string, config?: AxiosRequestConfig) {
    return this.request(Object.assign(config || {}, { method, url }))
  }

  requestMethodWithData(method: Method, url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request(Object.assign(config || {}, { method, url, data }))
  }
  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this.requestMethodWithData('options', url, data, config)
  }
  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this.requestMethodWithData('put', url, data, config)
  }
  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this.requestMethodWithData('patch', url, data, config)
  }
  getUrl(config: AxiosRequestConfig): string {
    config = mergeConfig(this.defaults, config)
    return transforUrl(config)
  }
}
