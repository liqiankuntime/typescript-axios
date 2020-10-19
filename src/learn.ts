// https://ts.xcatliu.com/
// 这里是学习 ts的简要笔记

// 对象的类型--接口
// 需要注意的是，一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集：
interface Person {
  name: string
  age?: number
  [propName: string]: any
}

let tomone: Person = {
  name: 'Tom',
  gender: 'male'
}

// 函数类型 -- 重载
function reverse(x: number): number
function reverse(x: string): string
function reverse(x: number | string): number | string {
  if (typeof x === 'number') {
    return Number(
      x
        .toString()
        .split('')
        .reverse()
        .join('')
    )
  } else if (typeof x === 'string') {
    return x
      .split('')
      .reverse()
      .join('')
  }
}
reverse(123)

interface ApiError extends Error {
  code: number
}
interface HttpError extends Error {
  statusCode: number
}

function isApiError(error: Error) {
  if (typeof (error as ApiError).code === 'number') {
    return true
  }
  return false
}

function copyFields<T extends U, U>(target: T, source: U): T {
  for (let id in source) {
    // target[id] = (<T>source)[id];
    // // target[id] = source[id];
    target[id] = (source as T)[id]
    // 将一个父类断言为一个更加具体的子类
    // (泛型的类型 一个是T类型，一个是U类型；这里的T继承了U;
    // 所以T是子类型； 断言的语法： 值 as 类型)
  }
  return target
}

let x = { a: 1, b: 2, c: 3, d: 4 }

copyFields(x, { b: 10, d: 20 })

interface Cat {
  name: string
  run(): void
}
interface Fish {
  name: string
  swim(): void
}
const tom: Cat = {
  name: 'Tom',
  run() {
    console.log('run')
  }
}
function isFish(animal: Cat | Fish) {
  if (typeof (animal as Fish).swim === 'function') {
    return true
  }
  return false
}

isFish(tom)

// 知识点： 非空断言( value! ) 表明 value可能有值
