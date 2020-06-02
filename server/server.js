require('./config/config');
const express = require('express')
const connect = require('./config/connect');
const bodyParser = require('body-parser')
const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())
    // definicion de peticiones para usuario
app.use(require('./routes/usuario'));
//conexion a base de datos
connect.connectMongoDB().then(resp => console.log('ok')).catch(err => console.log('err'));
//Web Server Start
app.listen(process.env.PORT, () => console.log(`Escuchando en el puerto ${process.env.PORT}`));