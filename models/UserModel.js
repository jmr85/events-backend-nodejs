"use strict";

let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let UsuarioSchema = Schema({
  nombre: String,
  mail: String,
  clave: String,
}, { versionKey: false });

module.exports = mongoose.model("Usuario", UsuarioSchema);
