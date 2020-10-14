import axios, { Canceler } from '../../src/index';
import { isCancel } from '../../src/cancel/cancel';
const CancelToken = axios.CancelToken;
const source = CancelToken.source();
console.log('CancelToken::', CancelToken);
axios.get(
    '/cancel/get',
    {
        cancelToken: source.token
    }).catch(e => {
    if(isCancel(e)){
        console.log('request Canceled>>>', e.message);
    }
})
setTimeout(() => {
    source.cancel('Operation is canceled by User');
    axios.post('/cancel/post', {a: '1'},{
        cancelToken: source.token
    }).catch(e => {
        if(axios.isCancel(e)){
            console.log('sett::', e.message);
        }
    })
}, 100)


let cancel: Canceler;
axios.get(
    '/cancel/get',
    {
        cancelToken: new CancelToken(e => {
            cancel = e;
        })
    }
).catch(res => {
    console.log('res:::', res);
    if(isCancel(res)){
        console.log('request Canceled');
    }
})
setTimeout(() => {
    cancel();
}, 200)