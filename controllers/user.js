"use strict";

var validator = require("validator");

var fs = require("fs");
var path = require("path");

var Usuario = require("../models/usuario");
const { isNumber } = require("util");

var controller = {

  save: (req, res) => {
    //1. Tomar los parametros por post
    var params = req.body;
    console.log("Pametros: ", params);
    //2. Validar datos (con la libreria validator)
    try {
      var validate_nombre = !validator.isEmpty(params.nombre); // cuando no esta vacio
      var validate_clave = !validator.isEmpty(params.clave);
      var validate_mail = !validator.isEmpty(params.mail);
    } catch (error) {
      return res.status(200).send({
        status: "error",
        Usuario: "Faltan datos por enviar",
      });
    }
    if (validate_nombre && validate_clave && validate_mail) {
      //3. Crear el objeto a guardar
      var usuario = new Usuario();
      //4. Asignar valores al objeto
      usuario.nombre = params.nombre;
      usuario.mail = params.mail;
      usuario.clave = params.clave;

      //5. Guardar el usuario
      usuario.save((err, userStored) => {
        if (err || !userStored) {
          return res.status(404).send({
            status: "error",
            message: "El usuario no se ha guardado !!!",
          });
        }
        //6. Devolver una respuesta
        return res.status(200).send(
          userStored
        );
      });
    } else {
      return res.status(200).send({
        status: "error",
        message: "Los datos no son validos !!!",
      });
    }
    return res.status(201).send(
      params
    );
  },

  getUsers: (req, res) => {
    var query = Usuario.find({});

    var last = req.query.last;
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

      return res.status(200).send(
        usuarios
      );
    });
  },
  getUser: (req, res) => {
    // Recoger el id de la urlss
    var userId = req.params.id;
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
    var userId = req.params.id;
    // tomar los datos (parametros) que llegan por put
    var params = req.body;
    // validar datos
    try {
      var validate_nombre = !validator.isEmpty(params.nombre); // cuando no esta vacio
      var validate_apellido = !validator.isEmpty(params.apellido);
      var validate_clave = !validator.isEmpty(params.clave);
      var validate_mail = !validator.isEmpty(params.mail);
    } catch (error) {
      return res.status(404).send({
        status: "error",
        message: "Faltan datos por enviar !!!",
      });
    }
    if (validate_nombre && validate_apellido && validate_clave && validate_mail) {
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
          return res.status(200).send(
            userUdate,
          );
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
    var userId = req.params.id;

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

      return res.status(200).send(
        userRemoved,
      );
    });
  }
}; // end controller

module.exports = controller;
