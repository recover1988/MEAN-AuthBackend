const { response, request } = require("express");
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

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
		const salt = bcrypt.genSaltSync(10);
		dbUser.password = bcrypt.hashSync(password, salt);

		// Generar el JWT -> metodo de autentificacion pasiva
		const token = await generarJWT(dbUser.id, name);

		// Crear usuario de DB
		await dbUser.save();
		// Generar respuesta exitosa
		return res.status(201).json({
			ok: true,
			uid: dbUser.id,
			name,
			email,
			token,
		});
	} catch (error) {
		return res.status(500).json({
			ok: false,
			msg: "Por favor hable con el administrador",
		});
	}
};

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
			email,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: "Hable con el administrador",
		});
	}
};

const revalidaToken = async (req, res) => {
	const { uid, name } = req;
	// Obtener el usuario
	const dbUser = await Usuario.findById(uid);
	// Generar el JWT -> metodo de autentificacion pasiva
	const token = await generarJWT(uid, name);
	// Respuesta del servicio
	return res.json({
		ok: true,
		uid,
		name,
		token,
		email: dbUser.email,
	});
};

module.exports = {
	crearUsuario,
	loginUsuario,
	revalidaToken,
};
