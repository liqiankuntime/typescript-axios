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
      // 这里要把Cancel当作值去使用，所以只能用'./cancel'里的Cancel而不是使用'./type'里的Cancel
      resolvePromise(this.reson)
    })
  }
  throwIfRequested(): void {
    if (this.reson) {
      throw this.reson
    }
  }
  static source(): CancelTokenSource {
    let cancel!: Canceler // 断言 cancel有值（定值断言 !）【确定分配断言符  !】
    // 手动确定 cancel这个变量一定有值
    const token = new CancelToken(c => {
      cancel = c
    })
    // c就是 executor 方法里的箭头函数吗？
    // c => {
    //   cancel = c
    // } 就是构造方法的 executor参数， 当executor()运行时，就是执行了cancel = c 这个语句了
    return {
      cancel,
      token
    }
  }
}
