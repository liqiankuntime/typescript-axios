import axios from '../../src/index';
import qs from 'qs';
axios.defaults.headers.common['test2'] = '123'; 

axios({
    url: '/config/post',
    method: 'post',
    data: qs.stringify({a: '12311'}),
    headers: {
        'test': '3211'
    }
}).then(res => {
    console.log('res:::', res);
})