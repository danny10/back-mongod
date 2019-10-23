var express = require('express');

var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var Factura = require('../models/factura');

var app = express();

//busqueda por id
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Factura.findById(id)
        .populate()
        .exec((err, facturas) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar la factura',
                    errors: err

                });
            }


            if (!facturas) {

                return res.status(400).json({
                    ok: false,
                    mensaje: 'La factura con el id' + id + ' No existe',
                    errors: { menssage: 'No existe la factura con ese id' }
                });
            }

            res.status(200).json({
                ok: true,
                facturas: facturas
            });

        });

});


//listado de todas las facturas
app.get('/', (req, res) => {

    var num_page = req.params.desde || 0;
    var limite = req.params.limite;
    var skip_page = 0;

    num_page = Number(num_page);
    limite = Number(limite);

    skip_page = (num_page - 1) * limite;

    Factura.find({})
        .skip(skip_page)
        .limit(limite)
        .exec((err, facturas) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando las facturas',
                    errors: err

                });
            }

            Factura.count({}, (err, conteo) => {

                res.status(200).json({

                    ok: true,
                    facturas: facturas,
                    total: conteo
                });

            });

        });

});


// crear facturas
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var facturas = new Factura({
        numero: body.numero,
        fecha: body.fecha,
        concepto: body.concepto,
        estado: body.estado,
        contrato: body.contrato,
        valor: body.valor,
        fecha_pago: body.fecha_pago,
        valor_pagado: body.valor_pagado,
        mes: body.mes,
        ano: body.ano

    });

    facturas.save((err, facturasGuardado) => {

        if (err) {
            return res.status(400).json({

                ok: true,
                mensaje: 'Error al crear la factura',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            facturas: facturasGuardado
        });

    });

});


//actualizar facturas
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Factura.findById(id, (err, facturas) => {
        if (err) {

            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar la factura',
                errors: err
            });
        }

        if (!facturas) {

            return res.status(400).json({
                ok: false,
                mensaje: 'La factura con el id' + id + ' No existe',
                errors: { menssage: 'No existe la factura con ese id' }

            });
        }

        facturas.numero = body.numero;
        facturas.fecha = body.fecha;
        facturas.concepto = body.concepto;
        facturas.estado = body.estado;
        facturas.contrato = body.contrato;
        facturas.valor = body.valor;
        facturas.fecha_pago = body.fecha_pago;
        facturas.valor_pagado = body.valor_pagado;
        facturas.mes = body.mes;
        facturas.ano = body.ano;

        facturas.save((err, facturasGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar la factura',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                facturas: facturasGuardado
            });

        });

    });

});


//Eliminar facturas
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Factura.findByIdAndRemove(id, (err, facturaBorrada) => {

        if (err) {
            return res.status(500).json({

                ok: false,
                mensaje: 'Error al borrar la factura',
                errors: err
            });
        }

        if (!facturaBorrada) {
            return res.status(400).json({

                ok: false,
                mensaje: 'No existe la factura con ese id',
                errors: { menssage: 'No existe la factura' }
            });
        }

        res.status(200).json({
            ok: true,
            facturas: facturaBorrada
        });


    });

});

module.exports = app;