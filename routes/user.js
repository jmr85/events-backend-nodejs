"use strict";

var express = require("express");

var UserController = require("../controllers/user");

var router = express.Router();

// Configurar el modulo connect multiparty
var multipart = require("connect-multiparty");
// middleware se ejecuta antes del metodo del controller
var md_upload = multipart({ uploadDir: "./upload/Users" });

// Rutas de prueba
router.post("/datos-persona", UserController.datosPersona);
router.get("/test-de-controlador", UserController.test);

// Rutas utiles
router.post("/save", UserController.save);
router.get("/Users/:last?", UserController.getUsers);
router.get("/User/:id", UserController.getUser);
router.put("/User/:id", UserController.update);
router.delete("/User/:id", UserController.delete);

module.exports = router;
