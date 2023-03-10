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
Se pueden poner mas validaciones con el check a la misma propiedad pero con mensaje diferentes y diferentes verificaciones.

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

Para eso usamos el `validationResult(req)` podemos verificar si tiene errores y pregunstar `.isEmpty()`.

### Middleware

Los middleware se ejecutan de forma sequencial. Son simples funciones que ademas necesitan de una funcion `next()` para indicar que continue con el proceso

```
const { request, response } = require("express");
const { validationResult } = require("express-validator");

const validarCampos = (req = request, res = response, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.json({
			ok: false,
			errors: errors.mapped(),
		});
	}
	next();
};

module.exports = {
	validarCampos,
};

```

## MongoDB

Para conectarse a la base de datos tenemos que ir a la pagina de MongoDB

```
https://www.mongodb.com/atlas/database
```

Crear una base de datos en un cluster, crear un usuario, y conectarse mediante mongo compass

```
BD_CNN=mongodb+srv://<USER>:<PASSWORD>@cluster0.n1lu7ro.mongodb.net/<Nombre de la Base de datos>
```

con esa cadena en el `.env` podemos realizar la coneccion en un `config.js`

```
// ./db/config.js

const mongoose = require("mongoose");

const dbConnection = async () => {
	try {
		mongoose.set("strictQuery", true);
		await mongoose.connect(process.env.BD_CNN);
		console.log("DB Online");
	} catch (error) {
		console.log(error);
		throw new Error("Error a la hora de inicializar la BD");
	}
};

module.exports = {
	dbConnection,
};

```

Y la conectamos en el `index.js` del root

```
// index.js

const { dbConnection } = require("./db/config");

dbConnection();
```

## Crear Modelo de base de datos

```
// models/Usuario.js

const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
});

module.exports = model("Usuario", UsuarioSchema);

```

El nombre del `Schema` debe ser en singular.

## Crear usuario en DB

```
// controllers/auth.js

const { response, request } = require("express");
const Usuario = require("../models/Usuario");

const crearUsuario = async (req = request, res = response) => {
	const { name, email, password } = req.body;
	try {
		// Verificar el email en DB
		const usuario = await Usuario.findOne({ email });

		if (usuario) {
			return res.status(400).json({
				ok: false,
				msg: "El usuario ya existe con ese email",
			});
		}
		// Crear usuario con el modelo
		const dbUser = new Usuario(req.body);
		// Hashear la contraseña
		// Generar el JWT -> metodo de autentificacion pasiva
		// Crear usuario de DB
		await dbUser.save();
		// Generar respuesta exitosa
		return res.status(201).json({
			ok: true,
			uid: dbUser.id,
			name,
		});
	} catch (error) {
		return res.status(500).json({
			ok: false,
			msg: "Por favor hable con el administrador",
		});
	}
};

```

Se importa el modelo Usuario y se llama con el metodo `.findOne({email})` para verificar que no este usado.
Luego se crea un `new Usuario(req.body)` y se lo guarda en la DB con el metodo `.save()`.
Al final se retorna una respuesta indicando que se creo el usuario.

## Hash de contraseña

Para hashear hace falta usar una libreria de terceros en este caso `bcryptjs`

```
// controllers/auth.js

const bcrypt = require("bcryptjs");

	// Hashear la contraseña
	const salt = bcrypt.genSaltSync(10);
	dbUser.password = bcrypt.hashSync(password, salt);

```

Podemos incrementar el numero de vueltas en `bcrypt.genSaltSync(10);` para generar una contraseña mas robusta pero eso generaria mayor carga.
Luego simplemente se modifica como si fuera un objeto.

## Generar JWT (json web token)

```
https://jwt.io/
```

El JWT consta de 3 parte que son:

- Header
- Payload
- Verify Signature
  Y es un elemto que sirve para realizar autentificacion pasiva.

```
(property) sign: (payload: any, secretOrPrivateKey: any, options: any, callback: any) => any
```

- `payload` es la informacion que se quiere enviar,
- `secretOrPrivateKey` es la llave que sirve para codificar
- `options` podemos definir la duracion
- `callback`

Para crear un JWT tenemos que hacer una funcion generadora que estara en una carpeta helpers

```
// helpers/jwt.js

const jwt = require("jsonwebtoken");

const generarJWT = (uid, name) => {
	const payload = { uid, name };

	return new Promise((resolve, reject) => {
		jwt.sign(
			payload,
			process.env.SECRET_JWT_SEED,
			{
				expiresIn: "24h",
			},
			(err, token) => {
				if (err) {
					// todo mal
					console.log(err);
					reject(err);
				} else {
					// todo bien
					resolve(token);
				}
			}
		);
	});
};

module.exports = {
	generarJWT,
};

```

Tambien necesitamos la clave en nuestro `.env`

```
// .env
SECRET_JWT_SEED=EstOdeBedeSerComplicado1as23412
```

Y en el controller simplemente lo invocamos y generamos el token que enviaremos como respues

```
	// Generar el JWT -> metodo de autentificacion pasiva
	const token = await generarJWT(dbUser.id, name);
```

## Login del Usuario

```
// controllers/auth.js

const loginUsuario = async (req = request, res = response) => {
	// Sino tiene errores responde
	const { email, password } = req.body;

	try {
		const dbUser = await Usuario.findOne({ email });
		if (!dbUser) {
			return res.status(400).json({
				ok: false,
				msg: "Usuario no valido",
			});
		}

		// Confirmar si el password hace match

		const validPassword = bcrypt.compareSync(password, dbUser.password);

		if (!validPassword) {
			return res.status(400).json({
				ok: false,
				msg: "Password no validas",
			});
		}

		// Generar el JWT -> metodo de autentificacion pasiva
		const token = await generarJWT(dbUser.id, dbUser.name);
		// Respuesta del servicio
		return res.json({
			ok: true,
			uid: dbUser.id,
			name: dbUser.name,
			token,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: "Hable con el administrador",
		});
	}
};

```

Para comparar el password y ver si hace match se usa la funcion del `bcrypt` que retorna un booleano.

```
const validPassword = bcrypt.compareSync(password, dbUser.password);

	if (!validPassword) {
		return res.status(400).json({
			ok: false,
			msg: "Password no validas",
		});
	}

```

## Renovar y Validar token

Por lo general se envia los tokens por el header, como `x-api-key` o `x-token`
El `header` se puede leer mediante

```
const token = req.header("x-token");
```

Se crea un middleware que valida el jwt

```
// middlewares/validar-jwt.js

const { response } = require("express");
const jwt = require("jsonwebtoken");

const validarJWT = (req, res = response, next) => {
	const token = req.header("x-token");

	if (!token) {
		return res.status(401).json({
			ok: false,
			msg: "error en el token",
		});
	}

	try {
		const { uid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED);
		req.uid = uid;
		req.name = name;
	} catch (error) {
		return res.status(401).json({
			ok: false,
			msg: "token no valido",
		});
	}

	// todo ok
	next();
};

module.exports = {
	validarJWT,
};

```

se verifica con el `jwt.verifiy(token, process.env.SECRET_JWT_SEED)` esto nos devuelve los elementos del `payload`.
Luego los pasamos al `controller` para generar un nuevo token

```
const revalidaToken = async (req, res) => {
	const { uid, name } = req;
	const token = await generarJWT(uid, name);
	return res.json({
		ok: true,
		uid,
		name,
		token,
	});
};

```

## Usar rutas de Angular

Para que use las rutas de Angular y node no trate de servir las rutas se usa el `.sendFile` en el `index.js` del root de node.

```
// index.js
const path = require("path");
// Manejar rutas
app.length("*", (res, res) => {
	res.sendFile(path.resolve(__dirname, "public/index.html"));
});
```
