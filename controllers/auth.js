const { response, request } = require("express");

const crearUsuario = (req = request, res = response) => {
	const { name, email, password } = req.body;
	console.log(name, email, password);
	return res.json({
		ok: true,
		msg: "Crear usuario /new",
	});
};

const loginUsuario = (req, res) => {
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
