const express = require('express')
const app = express()

// definicion de peticiones para usuario
app.use(require('./login'));
app.use(require('./usuario'));

module.exports = app;