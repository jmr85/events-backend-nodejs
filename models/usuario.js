'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    nombre: String,
    apellido: String,
    mail: String,
    clave: String   
});

module.exports = mongoose.model('Usuario', UsuarioSchema);