'use strict'

const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();
//let port = 4000;

mongoose.set('useFindAndModify', false);

mongoose.Promise = global.Promise;

mongoose.connect(process.env.DB_CNN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
    .then(() => {
        console.log('La conexion a la base de datos correcta!!!!');
        //crear  servidor y ponerme a escuchar peticiones HTTP
        app.listen(process.env.PORT, () => {
            console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
        });
    }).catch(err => {
        console.log(`Promise Rejected ${err}`);
    });

