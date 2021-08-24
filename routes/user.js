"use strict";

var express = require("express");

var UserController = require("../controllers/user");

var router = express.Router();

// Rutas usuarios
router.post("/usuarios", UserController.save);
router.get("/usuarios", UserController.getUsers);
router.get("/usuarios/:id", UserController.getUser);
router.put("/usuarios/:id", UserController.update);
router.delete("/usuarios/:id", UserController.delete);

module.exports = router;
