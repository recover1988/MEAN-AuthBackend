const express = require("express");
const cors = require("cors");

// Crear el servidor/aplicacion de express
const app = express();

// Cors
app.use(cors());

// Lectura y parseo del body
app.use(express.json())

// Rutas
app.use("/api/auth", require("./routes/auth"));

app.listen(4000, () => {
	console.log(`Servidor corriendo en puerto ${4000}`);
});