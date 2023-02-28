const { response, request } = require("express");

const crearUsuario = (req = request, res = response) => {
	console.log(req.body);
	return res.json({
		ok: true,
		msg: "Crear usuario /new",
	});
};

const loginUsuario = (req, res) => {
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
