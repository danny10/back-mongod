var express = require('express');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var Roles = require('../models/roles');

var app = express();

//busqueda por id
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Roles.findById(id)
        .populate()
        .exec((err, roles) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar el rol',
                    errors: err
                });
            }

            if (!roles) {

                return res.status(400).json({
                    ok: false,
                    mensaje: 'El role con el id' + id + ' No existe',
                    errors: { menssage: 'No existe el rol con ese id' }
                });
            }

            res.status(200).json({
                ok: true,
                roles: roles
            });


        });

});


//listado de los roles paginados
app.get('/', (req, res) => {

    var num_page = req.params.desde || 0;
    var limite = req.params.limite;
    var skip_page = 0;

    num_page = Number(num_page);
    limite = Number(limite);

    skip_page = (num_page - 1) * limite;

    Roles.find({})
        .skip(skip_page)
        .limit(limite)
        .exec((err, roles) => {

            if (err) {
                return res.status(500).json({

                    ok: false,
                    mensaje: 'Error cargando los roles',
                    errors: err
                });
            }

            Roles.count({}, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    roles: roles,
                    total: conteo
                });

            });

        });

});


// crear roles
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var roles = new Roles({
        nombre: body.nombre,
        estado: body.estado

    });

    roles.save((err, rolesGuardado) => {

        if (err) {
            return res.status(400).json({

                ok: true,
                mensaje: 'Error al crear el rol',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            roles: rolesGuardado
        });

    });

});


//actualizar roles

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Roles.findById(id, (err, roles) => {
        if (err) {

            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el rol',
                errors: err
            });
        }

        if (!roles) {

            return res.status(400).json({
                ok: false,
                mensaje: 'El rol con el id' + id + ' No existe',
                errors: { menssage: 'No existe el rol con ese id' }

            });
        }

        roles.nombre = body.nombre;
        roles.estado = body.estado;

        roles.save((err, rolesGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar los roles',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                roles: rolesGuardado
            });

        });

    });

});


//Eliminar roles
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Roles.findByIdAndRemove(id, (err, roleBorrado) => {

        if (err) {
            return res.status(500).json({

                ok: false,
                mensaje: 'Error al borrar el usuario',
                errors: err
            });
        }

        if (!roleBorrado) {
            return res.status(400).json({

                ok: false,
                mensaje: 'No existe el rol con ese id',
                errors: { menssage: 'No existe el rol' }
            });
        }

        res.status(200).json({
            ok: true,
            roles: roleBorrado
        });


    });

});

module.exports = app;