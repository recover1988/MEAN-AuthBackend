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

const loginUsuario = (req = request, res = response) => {
	// Sino tiene errores responde
	const { email, password } = req.body;

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
