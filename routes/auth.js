const { Router } = require("express");
const { check } = require("express-validator");
const {
	crearUsuario,
	revalidaToken,
	loginUsuario,
} = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

// Crear un nuevo usuario // Controlador de la ruta
router.post(
	"/new",
	[
		check("name", "El nombre es obligatorio").notEmpty(),
		check("name", "El nombre minimo de 6").isLength({ min: 6 }),
		check("email", "El email es obligatorio").isEmail(),
		check("password", "La contraseña es obligatoria").isLength({ min: 6 }),
		validarCampos,
	],
	crearUsuario
);
// Login de Usuario
router.post(
	"/",
	[
		check("email", "El email es obligatorio").isEmail(),
		check("password", "La contraseña es obligatorio").isLength({ min: 6 }),
		validarCampos,
	],
	loginUsuario
);
// Validar y revalidar token
router.get("/renew", revalidaToken);

module.exports = router;
