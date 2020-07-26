import axios, { AxiosTransformer } from '../../src/index';
import qs from 'qs';
axios.defaults.headers.common['test2'] = '123'; 

// axios({
//     url: '/config/post',
//     method: 'post',
//     data: qs.stringify({a: '12311'}),
//     headers: {
//         'test': '3211'
//     }
// }).then(res => {
//     console.log('res:::', res);
// })


axios({
    url: '/config/post',
    method: 'post',
    data: {a: '12311'},
    headers: {
        'test': '3211'
    },
    transformRequest: [
        function(data){
            return qs.stringify(data);
        }, 
        ...(axios.defaults.transformRequest as AxiosTransformer[])
    ],
    transformResponse: [
        ...(axios.defaults.transformRequest as AxiosTransformer[]),
        function(data){
            if(typeof data === 'object'){
                data.b = 2;
            }
            return data;
        }
    ]
}).then(res => {
    console.log('res:::', res);
})