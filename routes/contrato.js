var express = require('express');

var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var Contrato = require('../models/contrato');

var app = express();

//listado por id
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Contrato.findById(id)
        .populate()
        .exec((err, contratos) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar el contrato',
                    errors: err
                });
            }

            if (!contratos) {

                return res.status(400).json({
                    ok: false,
                    mensaje: 'El contrato con el id' + id + ' No existe',
                    errors: { menssage: 'No existe el contrato con ese id' }
                });
            }

            res.status(200).json({
                ok: true,
                contratos: contratos
            });

        });

});


//listado paginado de los contrato
app.get('/', (req, res) => {

    var num_page = req.params.desde || 0;
    var limite = req.params.limite;
    var skip_page = 0;

    num_page = Number(num_page);
    limite = Number(limite);

    skip_page = (num_page - 1) * limite;

    Contrato.find({})
        .skip(skip_page)
        .limit(limite)
        .exec((err, contratos) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando los contratos',
                    errors: err

                });
            }

            Contrato.count({}, (err, conteo) => {

                res.status(200).json({

                    ok: true,
                    contratos: contratos,
                    total: conteo
                });

            });

        });

});


// crear contratos
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var contratos = new Contrato({
        nombre: body.nombre,
        numero: body.numero,
        centro: body.centro,
        estado: body.estado,
        ano: body.ano,
        tipo: body.tipo
    });

    contratos.save((err, contratosGuardado) => {

        if (err) {
            return res.status(400).json({

                ok: true,
                mensaje: 'Error al crear el contratos',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            contratos: contratosGuardado
        });

    });

});


//actualizar contratos
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Contrato.findById(id, (err, contratos) => {
        if (err) {

            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el contrato',
                errors: err
            });
        }

        if (!contratos) {

            return res.status(400).json({
                ok: false,
                mensaje: 'El contrato con el id' + id + ' No existe',
                errors: { menssage: 'No existe el contrato con ese id' }

            });
        }

        contratos.nombre = body.nombre;
        contratos.numero = body.numero;
        contratos.centro = body.centro;
        contratos.estado = body.estado;
        contratos.ano = body.ano;
        contratos.tipo = body.tipo;

        contratos.save((err, contratosGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el contrato',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                contratos: contratosGuardado
            });

        });

    });

});


//Eliminar contratos
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Contrato.findByIdAndRemove(id, (err, contratoBorrado) => {

        if (err) {
            return res.status(500).json({

                ok: false,
                mensaje: 'Error al borrar el contrato',
                errors: err
            });
        }

        if (!contratoBorrado) {
            return res.status(400).json({

                ok: false,
                mensaje: 'No existe el contrato con ese id',
                errors: { menssage: 'No existe el contrato' }
            });
        }

        res.status(200).json({
            ok: true,
            contratos: contratoBorrado
        });


    });

});

module.exports = app;