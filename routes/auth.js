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
