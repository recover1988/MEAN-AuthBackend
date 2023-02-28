const { response, request } = require("express");
const { validationResult } = require("express-validator");

const crearUsuario = (req = request, res = response) => {
	const { name, email, password } = req.body;
	console.log(name, email, password);
	return res.json({
		ok: true,
		msg: "Crear usuario /new",
	});
};

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

const revalidaToken = (req, res) => {
	return res.json({
		ok: true,
		msg: "Renew",
	});
};

module.exports = {
	crearUsuario,
	loginUsuario,
	revalidaToken,
};
