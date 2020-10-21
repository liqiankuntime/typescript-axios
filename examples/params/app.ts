import { AxiosError } from '../../src/helpers/error';
import axios from '../../src/index';



axios.get('/more/get', {
    params: new URLSearchParams('a=b&c=d')
}).then(res => {
    console.log('get:', res)
})

axios.get('/more/get', {
    params: {
        a: '1',
        b: '2',
        c: [1,2,3]
    }
}).then(res => {
    console.log('get:', res)
})


const instance = axios.create({
    paramsSerializer(params){
        return qs.stringify(params, {arrayFormat: 'brackets'})
    }
})
instance.get('/more/get', {
    params: {
        a: '1',
        b: '2',
        c: [1,2,3]
    }
}).then(res => {
    console.log('get:', res)
})



