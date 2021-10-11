"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UsuarioSchema = Schema({
  nombre: String,
  mail: String,
  clave: String,
}, { versionKey: false });

UsuarioSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

module.exports = mongoose.model("Usuario", UsuarioSchema);
