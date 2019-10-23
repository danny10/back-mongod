var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var Departamento = require('../models/departamento');

var app = express();

//listado de los departamentos
app.get('/', (req, res) => {

    Departamento.find({})
        .exec((err, departamentos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Errror al buscar los departamentos',
                    errors: err

                });
            }

            Departamento.count({}, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    total: conteo,
                    departamentos: departamentos

                });

            });

        });
});

//crear departamento
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var departamentos = new Departamento({
        nombre: body.nombre
    });

    departamentos.save((err, departamentoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al guardar el departamento',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            departamentos: departamentoGuardado
        });

    });
});


//actualizar departmanetos
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Departamento.findById(id, (err, departamentos) => {
        if (err) {

            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el departamento',
                errors: err
            });
        }

        if (!departamentos) {

            return res.status(400).json({
                ok: false,
                mensaje: 'El departamento con el id' + id + ' No existe',
                errors: { menssage: 'No existe el departamento con ese id' }

            });
        }

        departamentos.nombre = body.nombre;

        departamentos.save((err, departamentosGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el departamento',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                departamentos: departamentosGuardado
            });

        });

    });

});


//Eliminar departamentos
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Departamento.findByIdAndRemove(id, (err, departamentosBorrado) => {

        if (err) {
            return res.status(500).json({

                ok: false,
                mensaje: 'Error al borrar el departamento',
                errors: err
            });
        }

        if (!departamentosBorrado) {
            return res.status(400).json({

                ok: false,
                mensaje: 'No existe el departamento con ese id',
                errors: { menssage: 'No existe el departamento' }
            });
        }

        res.status(200).json({
            ok: true,
            departamentos: departamentosBorrado
        });


    });

});

module.exports = app;