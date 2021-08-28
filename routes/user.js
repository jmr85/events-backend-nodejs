"use strict";

var express = require("express");

var UserController = require("../controllers/UserController");
var TestController = require("../controllers/TestController");

var router = express.Router();

// Rutas usuarios
router.post("/usuarios", UserController.save);
router.post("/usuarios", UserController.login);
router.get("/test", TestController.get);
router.get("/usuarios", UserController.getUsers);
router.get("/usuarios/:id", UserController.getUser);
router.put("/usuarios/:id", UserController.update);
router.delete("/usuarios/:id", UserController.delete);

module.exports = router;
