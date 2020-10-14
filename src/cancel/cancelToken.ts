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
      console.log(
        'message:',
        message,
        '什么样的运行机制？message是从哪来的',
        'source静态方法里的赋值new CancelToken(c => {cancel = c})'
      )
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
    let cancel!: Canceler // 断言 cancel有值（定值断言 !）【确定分配断言符  !】
    // 手动确定 cancel这个变量一定有值
    const token = new CancelToken(c => {
      cancel = c
    })
    console.log('ccc:搞明白运行的机制，c是什么值， c就是 executor 方法里的箭头函数吗？')
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
