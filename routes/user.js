"use strict";

let express = require("express");

let UserController = require("../controllers/UserController");
let TestController = require("../controllers/TestController");

let router = express.Router();

// Rutas usuarios
router.post("/usuarios", UserController.save);
router.post("/login", UserController.login);
router.get("/test", TestController.get);
router.get("/usuarios", UserController.getUsers);
router.get("/usuarios/:id", UserController.getUser);
router.put("/usuarios/:id", UserController.update);
router.delete("/usuarios/:id", UserController.delete);

module.exports = router;
