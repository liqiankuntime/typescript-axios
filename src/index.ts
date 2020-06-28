import { AxiosRequestConfig } from './types'
import xhr from './xhr'
import { buildUrl } from './helpers/url'

function axios(config: AxiosRequestConfig): void {
  // TODO
  processParams(config)
  xhr(config)
}

function processParams(config: AxiosRequestConfig): void {
  config.url = transforUrl(config)
}

function transforUrl(config: AxiosRequestConfig): string {
  let { url, params } = config
  return buildUrl(url, params)
}

export default axios
