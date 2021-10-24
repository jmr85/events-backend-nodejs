"use strict";

const Usuario = require("../models/UserModel");
const validator = require("validator");
const md5 = require("md5");

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

  let validate_mail_format = validator.isEmail(params.mail);

  let err;

  if (validate_nombre || validate_clave || validate_mail) {
    err = generateError("Error", "campo vacio");
  } else if (!validate_mail_format) {
    err = generateError("Error", "formato email invalido");
  }

  return err;
}
async function getUsers(req, res) {
  let query = Usuario.find({});

  let last = req.query.last;
  console.log(last);

  if (last && last != undefined && !isNaN(last)) {
    console.log("Linea 78: ", last);
    query.limit(parseInt(last));
  }
  // find
  await query.sort("-_id").exec((err, usuarios) => {
    if (err) {
      console.error(err);
      res.status(500).send({
        status: "error",
        message: "Error al devolver los usuarios !!!",
      });
    }

    if (!usuarios || usuarios.length === 0) {
      res.status(404).send({
        status: "error",
        message: "No hay usuarios para mostrar !!!",
      });
    }

    res.status(200).json(usuarios);
  });
}
async function save(req, res) {
  let params = req.body;
  let errValidation = validateUser(params);
  console.log("Pametros: ", params);

  if (!errValidation) {

    let usuario = populateUser(params);

    try {

      const existeEmail = await Usuario.findOne({ mail: usuario.mail });

      if (existeEmail) {
        return res.status(400).send({
          ok: false,
          msg: 'Existe un usuario con ese email'
        });
      }

      let newPass = md5(usuario.clave);
      usuario.clave = newPass;

      await usuario.save((err, userCreate) =>
        callbackUserCreate(err, userCreate, res)
      );

    } catch (err) {
      console.log(err);
      res.status(500).send({
        ok: false,
        msg: 'Error inesperado... revisar logs'
      });
    }

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
    let validPassword = md5(clave) === usuario.clave;
    console.log("login: ", clave, usuario.clave, validPassword);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password incorrecto",
      });
    }

    // Devolverlo en json
    return res.status(200).send(
      {
        "id": usuario._id,
        "nombre": usuario.nombre,
        "mail": usuario.mail,
        "clave": usuario.clave
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
}

async function update(req, res) {
  // tomar el id de usuario que viene por la url
  let userId = req.params.id;
  // tomar los datos (parametros) que llegan por put
  let params = req.body;
  // validar datos
  let errValidation = validateUser(params);

  if (
    !errValidation
  ) {
    try {
      const usuarioDB = await Usuario.findById(userId);
      if (usuarioDB.mail !== params.mail) {
        const existeEmail = await Usuario.findOne({ mail: params.mail });
        if (existeEmail) {
          return res.status(400).json({
            ok: false,
            msg: 'Ya existe un usuario con ese email'
          });
        }
      }
      // Encriptar contraseña

      let newPass = md5(params.clave);
      params.clave = newPass;

      // Hacer un Find and Update
      await Usuario.findByIdAndUpdate({ _id: userId }, params, { omitUndefined: true, new: true }, (err, userUdate) => {
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

    } catch (error) {
      console.log(error);
      return res.status(500).send({
        ok: false,
        msg: "Por favor hable con el administrador",
      });
    }
  } else {
    return res.status(400).send(errValidation);
  }

}

async function getUser(req, res) {
  // Toma el id de la url
  let userId = req.params.id;
  // Comprueba que existe
  if (!userId || userId == null) {
    return res.status(404).send({
      status: "error",
      message: "No existe el usuario !!!",
    });
  }
  // Busca el usuario
  await Usuario.findById(userId, (err, usuario) => {
    if (err || !usuario) {
      return res.status(404).send({
        status: "error",
        message: "No existe el usuario !!!",
      });
    }
    // Devolverlo en json
    return res.status(200).send(usuario);//send por defecto devuelve en json
  });
}

async function deleteUser(req, res) {
  // Recoger el id de la url
  let userId = req.params.id;

  try {
    // Find and delete
    await Usuario.findOneAndDelete({ _id: userId }, (err, userRemoved) => {
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
  } catch (error) {
    console.log("Error deleteUser: ", error);
    res.status(500).json({
      message: 'Error inesperado'
    });
  }

}

module.exports = {
  login,
  getUsers,
  getUser,
  save,
  deleteUser,
  update
}