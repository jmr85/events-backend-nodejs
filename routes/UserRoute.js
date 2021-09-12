"use strict";

let express = require("express");

let UserController = require("../controllers/UserController");
let TestController = require("../controllers/TestController");

let router = express.Router();

// Ruta de prueba
router.get("/test", TestController.get);

// Rutas usuarios
router.post("/login", UserController.login);
router.post("/usuarios", UserController.save);
router.get("/usuarios", UserController.getUsers);
router.get("/usuarios/:id", UserController.getUser);
router.put("/usuarios/:id", UserController.update);
router.delete("/usuarios/:id", UserController.deleteUser);

module.exports = router;
