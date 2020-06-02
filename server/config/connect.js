const mongoose = require('mongoose');

const connectMongoDB = async() => {
    const db = await mongoose.connect(process.env.URLDB, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err, resp) => {
        if (err) throw err;
        console.log('Base de datos Online');
    });
    return db;
}

module.exports = {
    connectMongoDB
}