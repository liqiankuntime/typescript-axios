import { ResolveFn, RejectFn } from '../types'

interface Interceptor<T> {
  resolved: ResolveFn<T>
  rejected?: RejectFn
}

export default class InterceptorManager<T> {
  private interceptors: Array<Interceptor<T> | null>
  constructor() {
    this.interceptors = []
  }
  use(resolved: ResolveFn<T>, rejected?: RejectFn) {
    this.interceptors.push({
      resolved,
      rejected
    })
    return this.interceptors.length - 1
  }
  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }

  /**
   * @param fn
   * 提供一个forEach方法，
   * 参数是一个方法，同时定义了这个参数方法的参数约束条件以及返回值的约束
   */

  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach(interceptorCell => {
      if (interceptorCell) {
        fn(interceptorCell)
      }
    })
  }
}
