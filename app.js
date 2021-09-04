"use strict";
//1. Cargar modulos de node para crear el servidor.
let express = require("express");
let bodyParser = require("body-parser");
//2. Ejecutar express (http)
let app = express();
//3. Cargar las rutas
let user_routes = require("./routes/user");

//4. Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //otro middleware convertir mediante parser cualquier tipo de peticion a json

//5. Activar el CORS para permitir peticiones desde el frontend.
// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

//6. Añadir prefijos a las rutas / Cargar rutas
//app.use("/api", user_routes);
app.use("/", user_routes); // lo de asi para adaptar al front android de orne

module.exports = app;
