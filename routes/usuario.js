//Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

//Inicializar variables
var app = express();

//importar modelo
var Usuario = require('../models/usuario');


//busqueda por id de usuario
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Usuario.findById(id)
        .populate()
        .exec((err, usuario) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar el usuario',
                    errors: err
                });
            }

            if (!usuario) {

                return res.status(400).json({
                    ok: false,
                    mensaje: 'El usuario con el id' + id + ' mo existe',
                    errors: { menssage: 'No existe el usuario con ese id' }
                });
            }

            res.status(200).json({
                ok: true,
                usuario: usuario
            });

        });

});



//Listado de todos los usuarios con paginacion
app.get('/', (req, res, next) => {

    var num_page = req.query.desde || 0;
    var limite = req.query.limite;
    var skip_page = 0;

    num_page = Number(num_page);
    limite = Number(limite);

    skip_page = (num_page - 1) * limite;

    Usuario.find({})
        .skip(skip_page)
        .limit(limite)
        .exec(
            (err, usuarios) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando los usuarios',
                        errors: err
                    });
                }

                Usuario.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: conteo
                    });

                });

            });
});


//Crear usuario
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        apellido: body.apellido,
        direccion: body.direccion,
        telefono: body.telefono,
        email: body.email,
        sexo: body.sexo,
        password: bcrypt.hashSync(body.password, 10),
        rol: body.rol,
        cedula: body.cedula
    });

    usuario.save((err, usuarioGuardar) => {

        if (err) {
            return res.status(400).json({
                ok: true,
                mensaje: 'Error al crear el usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardar
        });

    });

});


//Actualizar Usuario
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id' + id + ' no existe',
                errors: { menssage: 'No existe el usuario con ese id' }
            });
        }

        usuario.cedula = body.cedula;
        usuario.nombre = body.nombre;
        usuario.apellido = body.apellido;
        usuario.direccion = body.direccion;
        usuario.telefono = body.telefono;
        usuario.email = body.email;
        usuario.sexo = body.sexo;
        usuario.rol = body.rol;


        usuario.save((err, usuarioGuardar) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el usuario',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardar
            });

        });

    });
});


//Eliminar usuario
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe el usuario con ese id',
                errors: { menssage: 'No existe el usuario' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });

});

module.exports = app;