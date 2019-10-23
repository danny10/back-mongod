var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var Municipio = require('../models/municipio');

var app = express();

//Listado de los municipios segun el departamento
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Municipio.find({ id_dep: id })
        .populate()
        .exec((err, municipios) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar el municipio',
                    errors: err
                });
            }

            if (!municipios) {

                return res.status(400).json({
                    ok: false,
                    mensaje: 'El municipio con el id' + id + ' No existe',
                    errors: { menssage: 'No existe el municipio con ese id' }
                });
            }

            res.status(200).json({
                ok: true,
                municipios: municipios
            });

        });

});


//Crear Municipio
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var municipios = new Municipio({
        id_dep: body.id_dep,
        nombre: body.nombre,
    });

    municipios.save((err, municipioGuardado) => {

        if (err) {
            return res.status(400).json({

                ok: true,
                mensaje: 'Error al crear el municipio',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            municipios: municipioGuardado
        });

    });

});


//actualizar municipios
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Municipio.findById(id, (err, municipios) => {
        if (err) {

            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el municipio',
                errors: err
            });
        }

        if (!municipios) {

            return res.status(400).json({
                ok: false,
                mensaje: 'El contrato con el id' + id + ' No existe',
                errors: { menssage: 'No existe el contrato con ese id' }

            });
        }

        municipios.nombre = body.nombre;
        municipios.id_dep = body.id_dep;

        municipios.save((err, municipiosGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el municipio',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                municipios: municipiosGuardado
            });

        });

    });

});


//Eliminar municipios
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Municipio.findByIdAndRemove(id, (err, municipioBorrado) => {

        if (err) {
            return res.status(500).json({

                ok: false,
                mensaje: 'Error al borrar el municipio',
                errors: err
            });
        }

        if (!municipioBorrado) {
            return res.status(400).json({

                ok: false,
                mensaje: 'No existe el municipio con ese id',
                errors: { menssage: 'No existe el municipio' }
            });
        }

        res.status(200).json({
            ok: true,
            municipios: municipioBorrado
        });


    });

});


module.exports = app;