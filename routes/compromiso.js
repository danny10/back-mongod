//Requires
var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');

//Inicializar variables
var app = express();

//importar modelo
var Compromiso = require('../models/compromiso');


//busqueda por id de compromiso
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Compromiso.findById(id)
        .populate()
        .exec((err, compromiso) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar el compromiso',
                    errors: err
                });
            }

            if (!compromiso) {

                return res.status(400).json({
                    ok: false,
                    mensaje: 'El compromiso con el id' + id + ' mo existe',
                    errors: { menssage: 'No existe el compromiso con ese id' }
                });
            }

            res.status(200).json({
                ok: true,
                compromiso: compromiso
            });

        });

});



//Listado de todos los Compromiso con paginacion
app.get('/', (req, res, next) => {

    var num_page = req.query.desde || 0;
    var limite = req.query.limite;
    var skip_page = 0;

    num_page = Number(num_page);
    limite = Number(limite);

    skip_page = (num_page - 1) * limite;

    Compromiso.find({})
        .skip(skip_page)
        .limit(limite)
        .exec(
            (err, compromisos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando los compromisos',
                        errors: err
                    });
                }

                Compromiso.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        compromisos: compromisos,
                        total: conteo
                    });

                });

            });
});


//Crear Compromiso
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var compromiso = new Compromiso({
        descripcion: body.descripcion,
        solicitante: body.solicitante,
        responsable_seguimiento: body.responsable_seguimiento,
        responsable_hacer: body.responsable_hacer
    });

    compromiso.save((err, compromisoGuardar) => {

        if (err) {
            return res.status(400).json({
                ok: true,
                mensaje: 'Error al crear el compromiso',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            compromiso: compromisoGuardar
        });

    });

});


//Actualizar Compromiso
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Compromiso.findById(id, (err, compromiso) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el compromiso',
                errors: err
            });
        }

        if (!compromiso) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El compromiso con el id' + id + ' no existe',
                errors: { menssage: 'No existe el compromiso con ese id' }
            });
        }

        compromiso.descripcion = body.descripcion;
        compromiso.solicitante = body.solicitante;
        compromiso.responsable_seguimiento = body.responsable_seguimiento;
        compromiso.responsable_hacer = body.responsable_hacer;


        compromiso.save((err, compromisoGuardar) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el compromiso',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                compromiso: compromisoGuardar
            });

        });

    });
});


//Eliminar Compromiso
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Compromiso.findByIdAndRemove(id, (err, compromisoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el compromiso',
                errors: err
            });
        }

        if (!compromisoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe el compromiso con ese id',
                errors: { menssage: 'No existe el compromiso' }
            });
        }

        res.status(200).json({
            ok: true,
            compromiso: compromisoBorrado
        });

    });

});

module.exports = app;