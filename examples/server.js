const express = require('express');
const bodyParser = require('body-parser');
const webpack = require('webpack');
const webpackDevMiddleWare = require('webpack-dev-middleware');
const webpackHotMiddleWare = require('webpack-hot-middleware');
const cookieParser = require('cookie-parser');
const WebpackConfig = require('./webpack.config');
const multipart = require('connect-multiparty');
const path = require('path');
const atob = require('atob');

// require('./server2');

const app = express();

const compiler = webpack(WebpackConfig);

app.use(webpackDevMiddleWare(compiler, {
    publicPath: '/__build__/',
    stats: {
        colors: true,
        chunks: false
    }
}))
app.use(webpackHotMiddleWare(compiler))

app.use(express.static(__dirname, {
    setHeaders(res){
        res.cookie('XSRF-TOKEN-D', '1234abc');
    }
}))

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser());

app.use(multipart({
    uploadDir: path.resolve(__dirname, 'upload-file')
}))

const router = express.Router();

registerSimpleRouter();
registerBaseRouter();
registerErrorRouter();
registerExtendRouter();
regitsterInterceptorRouter();
regitsterConfigRouter();
regitsterCancelRouter();
regitsterMoreRouter();

app.use(router)

const port =  8080
module.exports = app.listen(port, () => {
    console.log(`server start at ${port}`)
})


function registerSimpleRouter(){
    router.get('/simple/get', (req, res) => {
        res.json({
            msg: 'hello word1'
        })
    })
    
}

function registerBaseRouter(){
    router.get('/base/get', (req, res) => {
        
        res.json({
            msg: req.query
        })
    })
    
    router.post('/base/post', (req, res) => {
        res.json(req.body)
    })
    router.post('/base/buffer', (req, res) => {
        let msg = [];
        req.on('data', (chunk) => {
            chunk && msg.push(chunk);
        });
        req.on('end', () => {
            let buf = Buffer.concat(msg);
            res.json(buf.toJSON());
        })
    })
}

function registerErrorRouter(){
    router.get('/error/get', (req, res) => {
        if(Math.random() > 0.5){
            res.json({
                msg: 'hello word'
            })
        }else {
            res.status(500);
            res.end();
        }
    })
    router.get('/error/timeout', (req, res) => {
        setTimeout(() => {
            res.json({
                msg: 'hello word!'
            })
        }, 5000)
    })
}

function registerExtendRouter(){
    router.get('/extend/user', (req, res) => {
        res.json({
            code: 0,
            msg: 'hello',
            result: {
                name: 'jack',
                b: 26
            }
        })
    });
    router.get('/extend/get', (req, res) => {
        res.json({
            msg: 'hello word'
        })
    });
    router.options('/extend/options', (req, res) => {
        res.end();
    });
    router.delete('/extend/delete', (req, res) => {
        res.end();
    });
    router.head('/extend/head', (req, res) => {
        res.end();
    });
    router.post('/extend/post', (req, res) => {
        res.json(req.body);
    });
    router.put('/extend/put', (req, res) => {
        res.json(req.body);
    });
    router.patch('/extend/patch', (req, res) => {
        res.json(req.body);
    });

}

function regitsterInterceptorRouter(){
    router.get('/interceptor/get', (req, res) => {
        res.json('hello word')
    });
}

function regitsterConfigRouter(){
    router.post('/config/post', (req, res) => {
        
        res.json(req.body);
    });
}

function regitsterCancelRouter(){
    router.get('/cancel/get', (req, res) => {
        setTimeout(()=> res.json('hello'), 1000)
    });

    router.post('/cancel/post', (req, res) => {
        
        setTimeout(()=>res.json(req.body), 1000 );
    });
}

function regitsterMoreRouter(){
    router.get('/more/get', (req, res) => {
        res.json(req.cookies);
    });
}

router.post('/more/upload', (req, res) => {
    console.log('req:', req.body, req.files);
    res.end('upload success!');
});

router.post('/more/post', (req, res) => {
    const auth = req.headers.authorization;
    const [type, credentials] = auth.split(' ') 
    console.log('atob:', atob(credentials));

    const [username, password] = atob(credentials).split(':');
    if(type === 'Basic' && username === 'Yee' && password === '123456a'){
        res.json(req.body);
    }else {
        res.status(401)
        res.end('UnAuthorizaiton!');
    }
});



router.post('/more/304', (req, res) => {
    console.log('req:', req.body, req.files);
    res.status(304);
    res.end('upload success!');
});