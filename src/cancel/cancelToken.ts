import { CancelExecutor, CancelTokenSource, Canceler } from '../types'
import Cancel from './cancel' // 类既可以当着值使用也可以当着 类型使用
interface ResolvePromise {
  (reason?: Cancel): void
}

export default class CancelToken {
  promise: Promise<Cancel>
  reson?: Cancel

  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    this.promise = new Promise<Cancel>(resolve => {
      resolvePromise = resolve
    })
    executor(message => {
      if (this.reson) {
        return
      }
      this.reson = new Cancel(message)
      resolvePromise(this.reson)
    })
  }
  throwIfRequested(): void {
    if (this.reson) {
      throw this.reson
    }
  }
  static source(): CancelTokenSource {
    let cancel!: Canceler // 断言 cancel有值
    const token = new CancelToken(c => {
      cancel = c
    })

    return {
      cancel,
      token
    }
  }
}
