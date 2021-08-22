"use strict";

var validator = require("validator");

var fs = require("fs");
var path = require("path");

var User = require("../models/user");
const { isNumber } = require("util");

var controller = {
  datosPersona: (req, res) => {
    var hola = req.body.hola;

    return res.status(200).send({
      nombre: "Juan",
      apellido: "Ruiz",
      hola,
    });
  },
  test: (req, res) => {
    return res.status(200).send({
      message: "Soy la accion test de mi controlador de Users",
    });
  },
  save: (req, res) => {
    //1. Tomar los parametros por post
    var params = req.body;
    console.log(params);
    //2. Validar datos (con la libreria validator)
    try {
      var validate_name = !validator.isEmpty(params.name); // cuando no esta vacio
      var validate_lastname = !validator.isEmpty(params.lastname);
    } catch (error) {
      return res.status(200).send({
        status: "error",
        User: "Faltan datos por enviar",
      });
    }
    if (validate_name && validate_lastname) {
      //3. Crear el objeto a guardar
      var user = new User();
      //4. Asignar valores al objeto
      user.name = params.name;
      user.lastname = params.lastname;

      //5. Guardar el user
      user.save((err, userStored) => {
        if (err || !userStored) {
          return res.status(404).send({
            status: "error",
            message: "El user no se ha guardado !!!",
          });
        }
        //6. Devolver una respuesta
        return res.status(200).send({
          status: "success",
          user: userStored,
        });
      });
    } else {
      return res.status(200).send({
        status: "error",
        message: "Los datos no son validos !!!",
      });
    }
    return res.status(200).send({
      User: params,
    });
  },
  getUsers: (req, res) => {
    var query = User.find({});

    var last = req.query.last;
    console.log(last);

    if (last && last != undefined && !isNaN(last)) {
      console.log("Linea 78: ", last);
      query.limit(parseInt(last));
    }
    // find
    query.sort("-_id").exec((err, users) => {
      if (err) {
        console.error(err);
        return res.status(500).send({
          status: "error",
          message: "Error al devolver los users !!!",
        });
      }
      
      if (!users || users.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No hay users para mostrar !!!",
        });
      }

      return res.status(200).send(
        users
      );
    });
  },
  getUser: (req, res) => {
    // Recoger el id de la url
    var userId = req.params.id;
    // Comprobar que existe
    if (!userId || userId == null) {
      return res.status(404).send({
        status: "error",
        message: "No existe el user !!!",
      });
    }
    // Buscar el user
    User.findById(userId, (err, user) => {
      if (err || !user) {
        return res.status(404).send({
          status: "error",
          message: "No existe el user !!!",
        });
      }
      // Devolverlo en json
      return res.status(200).send({
        status: "success",
        user,
      });
    });
  },
  update: (req, res) => {
    // tomar el id de user que viene por la url
    var userId = req.params.id;
    // tomar los datos (parametros) que llegan por put
    var params = req.body;
    // validar datos
    try {
      var validate_name = !validator.isEmpty(params.name);
      var validate_lastname = !validator.isEmpty(params.lastname);
    } catch (error) {
      return res.status(404).send({
        status: "error",
        message: "Faltan datos por enviar !!!",
      });
    }
    if (validate_name && validate_lastname) {
      // Hacer un Find and Update
      User.findByIdAndUpdate(
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
              message: "No existe el user !!!",
            });
          }
          return res.status(200).send({
            status: "success",
            user: userUdate,
          });
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
    User.findOneAndDelete({ _id: userId }, (err, userRemoved) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error al borrar !!!",
        });
      }

      if (!userRemoved) {
        return res.status(404).send({
          status: "error",
          message: "No se ha borrado el user, posiblemente no exista !!!",
        });
      }

      return res.status(200).send({
        status: "success",
        user: userRemoved,
      });
    });
  }
}; // end controller

module.exports = controller;
