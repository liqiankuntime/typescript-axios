const express = require('express');
const bodyParser = require('body-parser');
const webpack = require('webpack');
const webpackDevMiddleWare = require('webpack-dev-middleware');
const webpackHotMiddleWare = require('webpack-hot-middleware');
console.log('333')
const WebpackConfig = require('./webpack.config');

const app = express();
console.log('111')
const compiler = webpack(WebpackConfig);
console.log('222', compiler)
app.use(webpackDevMiddleWare(compiler, {
    publicPath: '/__build__/',
    stats: {
        colors: true,
        chunks: false
    }
}))
app.use(webpackHotMiddleWare(compiler))

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


const router = express.Router();

registerSimpleRouter();
registerBaseRouter();
registerErrorRouter();
registerExtendRouter();

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
        console.log('resss::', req);
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







