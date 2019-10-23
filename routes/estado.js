var express = require('express');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var Estado = require('../models/estado');

var app = express();

app.get('/:id', (req, res) => {

    var id = req.params.id;

    Estado.findById(id)
        .populate()
        .exec((err, estados) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar el contrato',
                    errors: err

                });
            }

            if (!estados) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El estado con el id' + id + ' No existe',
                    errors: { menssage: 'No existe el estado con ese id' }
                });
            }

            res.status(200).json({
                ok: true,
                estados: estados
            });

        });

});


//listado de todos los estados
app.get('/', (req, res) => {

    var num_page = req.params.desde || 0;
    var limite = req.params.limite;
    var skip_page = 0;

    num_page = Number(num_page);
    limite = Number(limite);

    skip_page = (num_page - 1) * limite;

    Estado.find({})
        .skip(skip_page)
        .limit(limite)
        .exec((err, estados) => {

            if (err) {
                return res.status(500).json({

                    ok: false,
                    mensaje: 'Error cargando los estados',
                    errors: err
                });
            }

            Estado.count({}, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    estados: estados,
                    total: conteo
                });

            });

        });

});


//crear estado
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var estado = new Estado({
        nombre: body.nombre,
        app: body.app,
        estado: body.estado

    });

    estado.save((err, estadoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el contratos',
                errors: err

            });
        }

        res.status(201).json({
            ok: true,
            estados: estadoGuardado
        });

    });
});


//Actualizar estado
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Estado.findById(id, (err, estados) => {

        if (err) {
            return res.status(400).json({

                ok: false,
                mensaje: 'Error al buscar el estado',
                errors: err
            });
        }

        if (!estados) {

            return res.status(400).json({
                ok: false,
                mensaje: 'El estado con el id' + id + ' No existe',
                errors: { menssage: 'No existe el estado con ese id' }

            });
        }

        estados.nombre = body.nombre;
        estados.app = body.app;
        estados.estado = body.estado;

        estados.save((err, estadoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar el estado',
                    errors: err
                });
            }

            res.status(201).json({
                ok: true,
                estados: estadoGuardado
            });

        });

    });

});


//Eliminar estados
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Estado.findByIdAndRemove(id, (err, estadoBorrado) => {

        if (err) {
            return res.status(500).json({

                ok: false,
                mensaje: 'Error al borrar el estado',
                errors: err
            });
        }

        if (!estadoBorrado) {
            return res.status(400).json({

                ok: false,
                mensaje: 'No existe el estado con ese id',
                errors: { menssage: 'No existe el estado' }
            });
        }

        res.status(200).json({
            ok: true,
            estados: estadoBorrado
        });


    });

});

module.exports = app;