import { AxiosInstance, AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/axios'
import mergeConfig from './core/mergeConfig'
import { extend } from './helpers'
import defaults from './default'
import CancelToken from './cancel/cancelToken'
import Cancel, { isCancel } from './cancel/cancel'

function createInstance(config: AxiosRequestConfig): AxiosStatic {
  // 1、包括扩展接口属性方法的类
  const context = new Axios(config)
  // 2、原本的axios的对象
  const instance = Axios.prototype.request.bind(context)
  // 然后把这个类(1)的原型属性和自身属性再拷贝到 axios(2) 上
  extend(instance, context)
  // 此时得到混合对象axios
  return instance as AxiosStatic
}

const axios = createInstance(defaults)
axios.create = function create(config: AxiosRequestConfig) {
  return createInstance(mergeConfig(defaults, config))
}
axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel

axios.all = function all(promises) {
  return Promise.all(promises)
}
axios.spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr)
  }
}
axios.Axios = Axios
export default axios
