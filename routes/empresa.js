var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');

var Empresa = require('../models/empresa');

var app = express();

//listado por id de la empresa
app.get('/:id', (req, res) => {
    var id = req.params.id;

    Empresa.findById(id)
        .populate()
        .exec((err, empresas) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar la empresa',
                    errors: err
                });
            }

            if (!empresas) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La empresa con el id' + id + ' No existe',
                    errors: { menssage: 'No existe la empresa con ese id' }
                });
            }

            res.status(200).json({
                ok: true,
                empresas: empresas
            });

        });
});

//Listado de las empresas paginadas
app.get('/', (req, res) => {

    var num_page = req.params.desde || 0;
    var limite = req.params.limite;
    var skip_page = 0;

    num_page = Number(num_page);
    limite = Number(limite);

    skip_page = (num_page - 1) * limite;

    Empresa.find()
        .skip(skip_page)
        .limit(limite)
        .exec((err, empresas) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Erro al buscar la empresa',
                    errors: err
                });
            }

            Empresa.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    total: conteo,
                    empresas: empresas
                });

            });

        });

});

//Guardar empresa
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var empresa = new Empresa({
        nombre: body.nombre,
        nit: body.nit,
        proveedor: body.proveedor
    });

    empresa.save((err, empresaGuardada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el contratos',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            empresa: empresaGuardada
        });

    });
});

//Actualizar empresa
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Empresa.findById(id, (err, empresas) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar la empresa',
                errors: err
            });
        }

        if (!empresas) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La empresa con el id' + id + ' No existe',
                errors: { menssage: 'No existe la empresa con ese id' }
            });
        }

        empresas.nombre = body.nombre;
        empresas.nit = body.nit;
        empresas.proveedor = body.proveedor;

        empresas.save((err, empresaGuardada) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar la empresa',
                    errors: err
                });
            }

            res.status(201).json({
                ok: true,
                empresas: empresaGuardada
            });

        });
    });

});


//Eliminar empresas
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Empresa.findByIdAndRemove(id, (err, empresaBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar la empresa',
                errors: err
            });
        }

        if (!empresaBorrado) {
            return res.status(400).json({

                ok: false,
                mensaje: 'No existe la empresa con ese id',
                errors: { menssage: 'No existe la empresa' }
            });
        }

        res.status(200).json({
            ok: true,
            empresas: empresaBorrado
        });

    });

});


module.exports = app;