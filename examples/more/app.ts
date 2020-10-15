import axios from '../../src/index';

document.cookie = 'a=b';


axios.get('/more/get').then((res) => {
    console.log('res::', res);
})

axios.post('http://127.0.0.1:8088/more/server2', {c: '3'}, {
    withCredentials: false
}).then(res => console.log('credential:', res))






