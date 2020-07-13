import axios from '../../src/index';


axios({
    url: '/extend/post',
    method: 'post',
    data: {
        msg: 'hello'
    }
})
axios('/extend/post', {
    method: 'post',
    data: {
        msg: 'hello'
    }
})

axios.request({
    url: '/extend/post',
    method: 'post',
    data: {
        msg: 'request'
    }
})

axios.get('/extend/get')
axios.options('/extend/options')
axios.delete('/extend/delete')
axios.head('/extend/head')
axios.post('/extend/post', {msg: "axios.post"} )
axios.put('/extend/put', {msg: "axios.put"} )
axios.patch('/extend/patch', {msg: "axios.patch"} )


interface ResponseData<T = any>{
    code: number
    result: T
    msg: string
}

interface User{
    name: string
    age: number
}

function getUser<T>(){
    return axios<ResponseData<T>>('/extend/user')
    .then(res => {console.log('rere:', res); return res.data})
    .catch(error => console.error(error))
}

async function test(){
    const user = await getUser<User>();
    if(user){
        console.log(user.result.name);
    }
}
test();