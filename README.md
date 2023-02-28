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

## Enpoints

Login(POST)

```
localhost:4000/api/auth/new
```

Renovar Token(POST)

```
localhost:4000/api/auth/renew
```

Nuevo Usuario(GET)

```
localhost:4000/api/auth
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

### Crear rutas en otro archivo

Crear una carpeta `routes` y dentro tendra las rutas de la authentificacion en este caso:

```
//auth.js

const { Router } = require("express");

const router = Router();

// Crear un nuevo usuario
// Controlador de la ruta
router.post("/new", (req, res) => {
	return res.json({
		ok: true,
		msg: "Crear usuario /new",
	});
});
// Login de Usuario
router.post("/", (req, res) => {
	return res.json({
		ok: true,
		msg: "Login de usuario",
	});
});
// Validar y revalidar token
router.get("/renew", (req, res) => {
	return res.json({
		ok: true,
		msg: "Renew",
	});
});

module.exports = router;

```

En node para importar usamos el `require()` y para exportar el `module.exports=`
Para usar estas rutas las tenemos que usar mediante el middleware `app.use()` y el `require()` de donde vienen las rutas que queremos añadir.

```
const express = require("express");

// Crear el servidor/aplicacion de express

const app = express();

// Rutas
app.use("/api/auth", require("./routes/auth"));

app.listen(4000, () => {
	console.log(`Servidor corriendo en puerto ${4000}`);
});

```

## Controladores

Es mejor separar los controllers que es el callback de los endpoints ya que estos tienden a crecer y es mejor tener la logica separada.

```
// controllers/auth.js

const crearUsuario = (req, res) => {
	return res.json({
		ok: true,
		msg: "Crear usuario /new",
	});
};

module.exports = {
	crearUsuario,
};

```

Y para usarlo en la ruta solamente los invocamos.

```
// Crear un nuevo usuario // Controlador de la ruta
router.post("/new", (req, res) => crearUsuario(req, res));

router.post("/new", crearUsuario);

```

## CORS (cross domain) y Parseo del body

```
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

```

Dentro del `cors()` pueden ir diferentes configuraciones como la ruta de la cual va a venir los datos, etc.
Con el `express.json()` podremos ver la info que viene por el body

## Extraer data del Request

```
const crearUsuario = (req = request, res = response) => {
	const { name, email, password } = req.body;
	console.log(name, email, password);
	return res.json({
		ok: true,
		msg: "Crear usuario /new",
	});
};

```

La info puede venir por el `req.body` y podemos desesctructurar la info.

## Variables de Entorno

En la raiz crear un archivo `.env` y en esta pondremos las variables de entorno que necesitemos tambien se puede crear otro archivo `.env.template` con la variables declaradas pero sin valores para que la persona que quiera ver usar la aplicacion sepa que variables de entorno necesita para correr el programa.

Para usar el dotenv necesitamos importarlo con la siguiente forma:

```
require("dotenv").config();
```

y para usar las variables simplemente le agregamos al final del `process.env`

```
app.listen(process.env.PORT, () => {
	console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
```

## Servir una pagina HTTP desde express

Crearse un directorio `public` y dentro poner un archivo html
luego desde el express.static() podemos llamar a `public` para que sirva la pagina.

```
// Directorio Publico
app.use(express.static("public"));
```

## Validar Campos Obligatorios con express.validator

Para ello utilizaremos `middlewares` que se colocan como segundo argumento en las rutas.

```
router.post([path] , [middlewares] , [controller])
```

```
const { Router } = require("express");
const { check } = require("express-validator");
const {
	crearUsuario,
	revalidaToken,
	loginUsuario,
} = require("../controllers/auth");

router.post(
	"/",
	[
		check("email", "El email es obligatorio").isEmail(),
		check("password", "La contraseña es obligatorio").isLength({ min: 6 }),
	],
	loginUsuario
);
```

El `check` ya tiene los metodos para verificar que los datos sean los correctos, luego en el controller podemos ver si da error.

```
const { response, request } = require("express");
const { validationResult } = require("express-validator");


const loginUsuario = (req = request, res = response) => {
	// Verificar si tiene errores
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.json({
			ok: false,
			errors: errors.mapped(),
		});
	}

	// Sino tiene errores responde
	const { email, password } = req.body;
	console.log(email, password);
	return res.json({
		ok: true,
		msg: "Login de usuario",
	});
};
```

Para eso usamos el `validationResult(req)` podemos verificar si tiene errores y pregunstar `.isEmpty()`
