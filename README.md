# MEAN-AuthBackend

Esta aplicacion en Node, usar las siguientes librerias:

```
	"dependencies": {
		"bcryptjs": "^2.4.3",
		"cors": "^2.8.5",
		"dotenv": "^16.0.3",
		"express": "^4.18.2",
		"express-validator": "^6.15.0",
		"jsonwebtoken": "^9.0.0",
		"mongoose": "^7.0.0"
	}
```

Los siguientes comandos:

```
	"scripts": {
		"test": "echo \"Error: no test specified\" && exit 1",
		"dev": "nodemon index.js",
		"start": "node index.js"
	},
```

## Crear Servidor y Ruta

Para crear el servirdor tenemos que usar el metodo `.listen` que habilita un puerto por el cual se podra interactuar.

```
const express = require("express");

// Crear el servidor/aplicacion de express

const app = express();

// GET
app.get("/", (req, res) => {
	console.log("peticion de /");
	res.status(200).json({
		ok: true,
		msg: "Todo salio bien",
		uid: 1234,
	});
});

app.listen(4000, () => {
	console.log(`Servidor corriendo en puerto ${4000}`);
});

```

Con el `app.get()` creamos el ENDPOINT de la API, y con el callback podemos pedir datos con el `request` y enviar o devolver datos con el `response`.

El `.status()` sirve para enviar un codigo http de respuesta:

- Respuestas informativas (100–199),
- Respuestas satisfactorias (200–299),
- Redirecciones (300–399),
- Errores de los clientes (400–499),
- Errores de los servidores (500–599).
  mas info en `https://developer.mozilla.org/es/docs/Web/HTTP/Status`

Podemos usar el `.send()` para enviar algun mensaje o el `.json()` para responder con un objeto tipo json.
