export function getAjaxRequest(): Promise<JasmineAjaxRequest> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve(jasmine.Ajax.requests.mostRecent())
    }, 0)
  })
}
