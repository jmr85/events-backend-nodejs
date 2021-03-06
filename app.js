"use strict";
//1. Cargar modulos de node para crear el servidor.
const express = require("express");
//2. Ejecutar express (http)
const app = express();
//3. Cargar las rutas
const user_routes = require("./routes/UserRoute");

//4. Middlewares
app.use(express.json()); //otro middleware convertir mediante parser cualquier tipo de peticion a json
app.use(express.urlencoded({ extended: false }));

//5. Activar el CORS para permitir peticiones desde el frontend.
// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  next();
});

//6. Añadir prefijos a las rutas / Cargar rutas
//app.use("/api", user_routes);
app.use("/", user_routes); // lo de asi para adaptar al front android de orne

module.exports = app;
