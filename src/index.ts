import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import xhr from './xhr'
import { transformRequest, buildUrl, processHeaders, transformResponse } from './helpers'

function axios(config: AxiosRequestConfig): AxiosPromise {
  // TODO
  console.log('header::::1', config)
  processConfig(config)
  return xhr(config).then(res => {
    return transformResponseData(res)
  })
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transforUrl(config)
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)
}

function transforUrl(config: AxiosRequestConfig): string {
  let { url, params } = config
  return buildUrl(url, params)
}

function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}

function transformHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config
  console.log('header::::', headers)
  return processHeaders(Headers, data)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transformResponse(res.data)
  return res
}

export default axios
