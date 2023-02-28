const { Router } = require("express");
const {
	crearUsuario,
	revalidaToken,
	loginUsuario,
} = require("../controllers/auth");

const router = Router();

// Crear un nuevo usuario // Controlador de la ruta
router.post("/new", crearUsuario);
// Login de Usuario
router.post("/", loginUsuario);
// Validar y revalidar token
router.get("/renew", revalidaToken);

module.exports = router;
