"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UsuarioSchema = Schema({
  nombre: String,
  mail: String,
  clave: String,
}, { versionKey: false });

module.exports = mongoose.model("Usuario", UsuarioSchema);
