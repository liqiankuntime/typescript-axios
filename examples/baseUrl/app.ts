import axios from '../../src/index';


const instance = axios.create({
    baseURL: 'https://img.mukewang.com/'
});

instance.get('lujing')