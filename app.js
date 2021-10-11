"use strict";
//1. Cargar modulos de node para crear el servidor.
const express = require("express");
const cors = require('cors')
//2. Ejecutar express (http)
const app = express();
//3. Cargar las rutas
const user_routes = require("./routes/UserRoute");

//4. Middlewares
app.use(cors());//5. Activar el CORS para permitir peticiones desde el frontend.
app.use(express.json()); //otro middleware convertir mediante parser cualquier tipo de peticion a json
app.use(express.urlencoded({ extended: false }));

//6. Añadir prefijos a las rutas / Cargar rutas
//app.use("/api", user_routes);
app.use("/", user_routes); // lo de asi para adaptar al front android de orne

module.exports = app;
