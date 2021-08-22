"use strict";

var express = require("express");

var UserController = require("../controllers/user");

var router = express.Router();

// Rutas utiles
router.post("/users", UserController.save);
router.get("/users", UserController.getUsers);
router.get("/users/:id", UserController.getUser);
router.put("/users/:id", UserController.update);
router.delete("/users/:id", UserController.delete);

module.exports = router;
