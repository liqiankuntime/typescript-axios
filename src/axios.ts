import { AxiosInstance, AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/axios'
import mergeConfig from './core/mergeConfig'
import { extend } from './helpers'
import defaults from './default'
import CancelToken from './cancel/cancelToken'
import Cancel, { isCancel } from './cancel/cancel'

function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  const instance = Axios.prototype.request.bind(context)
  extend(instance, context)
  return instance as AxiosStatic
}

const axios = createInstance(defaults)
console.log('axios:::', typeof axios, axios)
axios.create = function create(config: AxiosRequestConfig) {
  return createInstance(mergeConfig(defaults, config))
}
axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel

export default axios
