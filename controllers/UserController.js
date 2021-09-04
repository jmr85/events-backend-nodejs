"use strict";

let validator = require("validator");

let fs = require("fs");
let path = require("path");

let Usuario = require("../models/usuario");
const { isNumber } = require("util");
const { populate } = require("../models/usuario");

let bcrypt = require("bcryptjs");

function generateError(status, message) {
  return { message: message, status: status };
}

function callbackUserCreate(err, userStored, res) {
  let result;
  if (err || !userStored) {
    result = res
      .status(404)
      .send(generateError("Err", "El usuario no se ha guardado !!!"));
  } else {
    result = res.status(201).send(userStored);
  }
  return result;
}

function populateUser(params) {
  //3. Crear el objeto a guardar
  let usuario = new Usuario();
  //4. Asignar valores al objeto
  usuario.nombre = params.nombre;
  usuario.mail = params.mail;
  usuario.clave = params.clave;

  return usuario;
}

function validateUser(params) {
  let validate_nombre = validator.isEmpty(params.nombre); // cuando no esta vacio
  let validate_clave = validator.isEmpty(params.clave);
  let validate_mail = validator.isEmpty(params.mail);

  let err;

  if (validate_nombre || validate_clave || validate_mail) {
    err = generateError("Error", "campo vacio");
  }
  return err;
}

async function save(req, res) {
  let params = req.body;
  let errValidation = validateUser(params);
  console.log("Pametros: ", params);

  if (!errValidation) {
    let usuario = populateUser(params);

    // Encriptar contraseña
    let salt = bcrypt.genSaltSync();

    usuario.clave = bcrypt.hashSync(usuario.clave, salt);

    await usuario.save((err, userCreate) =>
      callbackUserCreate(err, userCreate, res)
    );
  } else {
    return res.status(400).send(errValidation);
  }
}

async function login(req, res) {
  let params = req.body;

  let mail = params.mail;
  let clave = params.clave;

  try {
    let usuario = await Usuario.findOne({ mail });

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe con ese mail",
      });
    }

    // Confirmar los passwords
    let validPassword = bcrypt.compareSync(clave, usuario.clave);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password incorrecto",
      });
    }

    // Devolverlo en json
    return res.status(200).send({
      usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
}

let controller = {
  getUsers: (req, res) => {
    let query = Usuario.find({});

    let last = req.query.last;
    console.log(last);

    if (last && last != undefined && !isNaN(last)) {
      console.log("Linea 78: ", last);
      query.limit(parseInt(last));
    }
    // find
    query.sort("-_id").exec((err, usuarios) => {
      if (err) {
        console.error(err);
        return res.status(500).send({
          status: "error",
          message: "Error al devolver los usuarios !!!",
        });
      }

      if (!usuarios || usuarios.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No hay usuarios para mostrar !!!",
        });
      }

      return res.status(200).send(usuarios);
    });
  },
  getUser: (req, res) => {
    // Recoger el id de la urlss
    let userId = req.params.id;
    // Comprobar que existe
    if (!userId || userId == null) {
      return res.status(404).send({
        status: "error",
        message: "No existe el usuario !!!",
      });
    }
    // Buscar el usuario
    Usuario.findById(userId, (err, usuario) => {
      if (err || !usuario) {
        return res.status(404).send({
          status: "error",
          message: "No existe el usuario !!!",
        });
      }
      // Devolverlo en json
      return res.status(200).send({
        usuario,
      });
    });
  },
  update: (req, res) => {
    // tomar el id de usuario que viene por la url
    let userId = req.params.id;
    // tomar los datos (parametros) que llegan por put
    let params = req.body;
    // validar datos
    try {
      let validate_nombre = !validator.isEmpty(params.nombre); // cuando no esta vacio
      let validate_apellido = !validator.isEmpty(params.apellido);
      let validate_clave = !validator.isEmpty(params.clave);
      let validate_mail = !validator.isEmpty(params.mail);
    } catch (error) {
      return res.status(404).send({
        status: "error",
        message: "Faltan datos por enviar !!!",
      });
    }
    if (
      validate_nombre &&
      validate_apellido &&
      validate_clave &&
      validate_mail
    ) {
      // Hacer un Find and Update
      Usuario.findByIdAndUpdate(
        { _id: userId },
        params,
        { new: true },
        (err, userUdate) => {
          if (err) {
            return res.status(500).send({
              status: "error",
              message: "Error al actualizar !!!",
            });
          }
          if (!userUdate) {
            return res.status(404).send({
              status: "error",
              message: "No existe el usuario !!!",
            });
          }
          return res.status(200).send(userUdate);
        }
      );
    } else {
      // Devolver respuesta
      return res.status(200).send({
        status: "error",
        message: "La validacion no es correcta !!!",
      });
    }
  },
  delete: (req, res) => {
    // Recoger el id de la url
    let userId = req.params.id;

    // Find and delete
    Usuario.findOneAndDelete({ _id: userId }, (err, userRemoved) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error al borrar !!!",
        });
      }

      if (!userRemoved) {
        return res.status(404).send({
          status: "error",
          message: "No se ha borrado el usuario, posiblemente no exista !!!",
        });
      }

      return res.status(200).send(userRemoved);
    });
  },
}; // end controller

module.exports = controller;
module.exports.save = save;
module.exports.login = login;
