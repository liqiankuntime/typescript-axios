import axios from '../../src/index';


axios.interceptors.request.use( config => {
    console.log('rererequest::', config, config.headers.test);
    config.headers.test += '1';
    return config;
})
axios.interceptors.request.use( config => {
    config.headers.test += '2';
    return config;
})
axios.interceptors.request.use( config => {
    console.log('rererequest::33', config, config.headers.test);
    config.headers.test += '3';
    return config;
})

axios.interceptors.response.use( res => {
    console.log('rerere:::22', res);
    res.data += '1';
    return res;
})
let interceptor = axios.interceptors.response.use( res => {
    console.log('rerere:::', res);
    res.data += '2';
    return res;
})
axios.interceptors.response.use( res => {
    res.data += '3';
    return res;
})

axios.interceptors.response.eject(interceptor)

axios({
    url: '/interceptor/get',
    method: 'get',
    headers: {
        test: ''
    }
}).then(res => console.log('rere::', res.data))