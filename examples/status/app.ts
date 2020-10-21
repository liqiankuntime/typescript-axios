import { AxiosError } from '../../src/helpers/error';
import axios from '../../src/index';



axios.get('/more/304').then(res => {
    console.log('get:', res)
}).catch((error: AxiosError) => {
    console.log('error:', error.message)
})


axios.get('/more/304', {
    validateStatus(status){
        return  status >= 200 && status < 400;
    }
}).then(res => {
    console.log('get:', res)
}).catch((error: AxiosError) => {
    console.log('error:', error.message)
})



