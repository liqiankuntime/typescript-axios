// import axios from '../../src';

import axios from "../../src";

// axios({
//     method: 'get',
//     url: '/base/get',
//     params: {
//         foo: ['baz', 'bar']
//     }
// })

// axios({
//     method: 'get',
//     url: '/base/get',
//     params: {
//         foo: {
//             baz: 'bar'
//         }
//     }
// })


// axios({
//     method: 'get',
//     url: '/base/get',
//     params: {
//         date: new Date()
//     }
// })

// axios({
//     method: 'post',
//     url: '/base/post',
//     data: {
//         a: 11,
//         b: 21
//     }
// })
// axios({
//     method: 'post',
//     url: '/base/post',
//     headers: {
//         'content-type': 'application/json',
//         'Accept': 'application/json, text/plain, */*'
//     },
//     data: {
//         a: 31,
//         b: 41
//     }
// })

// // axios({
// //     method: 'post',
// //     url: '/base/buffer',
// //     data: new Int32Array([121,231])
// // })

// const paramsString = 'q=URLUtils.searchparams&topic=api';
// const searchParams = new URLSearchParams(paramsString);
// console.log('searchParams::', searchParams);
// axios({
//     method: 'post',
//     url: '/base/post',
//     data: searchParams
// })

// 处理返回值的例子
axios({
    method: 'post',
    url: '/base/post',
    data: {
        a: 1,
        b: 2
    }
}).then((res) => {
    console.log('resss::', res)
})

axios({
    method: 'post',
    url: '/base/post',
    responseType: 'json',
    data: {
        c: 3, d: 4
    }
}).then(res => console.log('then::', res))





