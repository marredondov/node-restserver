//========================
// Puerto
//=======================
process.env.PORT = process.env.PORT || 3000;

// ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//BASE DE DATOS
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//========================
// Vencimiento del token
//=======================
process.env.CADUCIDAD_TOKEN = '48h';
//========================
// SEED de autenticacion
//=======================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//========================
// CLIENT_ID de google
//=======================
process.env.CLIENT_ID = process.env.CLIENT_ID || '32358202983-js83lq6bk03dpnjat02rp7u44olffcv6.apps.googleusercontent.com';