var express = require('express');

var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var Tipo = require('../models/tipo');
var app = express();

app.get('/:id', (req, res) => {

    var id = req.params.id;

    Tipo.findById(id)
        .populate()
        .exec((err, tipos) => {

            if (err) {
                return res.status(500).json({

                    ok: false,
                    mensaje: 'Error al buscar el tipo',
                    errors: err
                });
            }

            if (!tipos) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El tipo con el id' + id + ' No existe',
                    errors: { menssage: 'No existe el tipo con ese id' }
                });
            }

            res.status(200).json({
                ok: true,
                tipos: tipos
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

    Tipo.find({})
        .skip(skip_page)
        .limit(limite)
        .exec((err, tipos) => {

            if (err) {
                return res.status(500).json({

                    ok: false,
                    mensaje: 'Error cargando los tipos',
                    errors: err
                });
            }

            Tipo.count({}, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    tipos: tipos,
                    total: conteo
                });

            });

        });

});


//crear tipos
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var tipo = new Tipo({
        nombre: body.nombre,
        app: body.app,
        estado: body.estado

    });

    tipo.save((err, tipoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el tipo',
                errors: err

            });
        }

        res.status(201).json({
            ok: true,
            tipos: tipoGuardado
        });

    });
});


//Actualizar tipo
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Tipo.findById(id, (err, tipos) => {

        if (err) {
            return res.status(400).json({

                ok: false,
                mensaje: 'Error al buscar el tipo',
                errors: err
            });
        }

        if (!tipos) {

            return res.status(400).json({
                ok: false,
                mensaje: 'El tipo con el id' + id + ' No existe',
                errors: { menssage: 'No existe el tipo con ese id' }

            });
        }

        tipos.nombre = body.nombre;
        tipos.app = body.app;
        tipos.estado = body.estado;

        tipos.save((err, tipoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar el tipo',
                    errors: err
                });
            }

            res.status(201).json({
                ok: true,
                tipos: tipoGuardado
            });

        });

    });

});


//Eliminar tipos
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Tipo.findByIdAndRemove(id, (err, tipoBorrado) => {

        if (err) {
            return res.status(500).json({

                ok: false,
                mensaje: 'Error al borrar el tipo',
                errors: err
            });
        }

        if (!tipoBorrado) {
            return res.status(400).json({

                ok: false,
                mensaje: 'No existe el tipo con ese id',
                errors: { menssage: 'No existe el tipo' }
            });
        }

        res.status(200).json({
            ok: true,
            tipos: tipoBorrado
        });


    });

});

module.exports = app;