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
console.log('222')
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
router.get('/simple/get', (req, res) => {
    res.json({
        msg: 'hello word1'
    })
})

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

app.use(router)

const port =  8080
module.exports = app.listen(port, () => {
    console.log(`server start at ${port}`)
})














