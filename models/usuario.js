"use strict";

let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let UsuarioSchema = Schema({
  nombre: String,
  mail: String,
  clave: String,
});

module.exports = mongoose.model("Usuario", UsuarioSchema);
