const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
console.log('cookie:', cookieParser);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser.json())


const router = express.Router();

const cors = {
    "Access-Control-Allow-Origin": "http://localhost:8080",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"

}

router.post('/more/server2', function(req, res){
    res.set(cors);
    res.json(req.cookie);
})

app.use(router)

const port =  8088
module.exports = app.listen(port, () => {
    console.log(`server start at ${port}`)
})

