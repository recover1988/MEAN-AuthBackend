const { Router } = require("express");
const { check } = require("express-validator");
const {
	crearUsuario,
	revalidaToken,
	loginUsuario,
} = require("../controllers/auth");

const router = Router();

// Crear un nuevo usuario // Controlador de la ruta
router.post("/new", crearUsuario);
// Login de Usuario
router.post(
	"/",
	[
		check("email", "El email es obligatorio").isEmail(),
		check("password", "La contraseña es obligatorio").isLength({ min: 6 }),
	],
	loginUsuario
);
// Validar y revalidar token
router.get("/renew", revalidaToken);

module.exports = router;
