//Requires
var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');

//Inicializar variables
var app = express();

//importar modelo
var Proyecto = require('../models/proyecto');


//busqueda por id de Proyecto
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Proyecto.findById(id)
        .populate()
        .exec((err, proyecto) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar el proyecto',
                    errors: err
                });
            }

            if (!proyecto) {

                return res.status(400).json({
                    ok: false,
                    mensaje: 'El proyecto con el id' + id + ' mo existe',
                    errors: { menssage: 'No existe el proyecto con ese id' }
                });
            }

            res.status(200).json({
                ok: true,
                proyecto: proyecto
            });

        });

});



//Listado de todos los Proyecto con paginacion
app.get('/', (req, res, next) => {

    var num_page = req.query.desde || 0;
    var limite = req.query.limite;
    var skip_page = 0;

    num_page = Number(num_page);
    limite = Number(limite);

    skip_page = (num_page - 1) * limite;

    Proyecto.find({})
        .skip(skip_page)
        .limit(limite)
        .exec(
            (err, proyectos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando los proyectos',
                        errors: err
                    });
                }

                Proyecto.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        proyectos: proyectos,
                        total: conteo
                    });

                });

            });
});


//Crear Proyecto
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var proyecto = new Proyecto({
        id_municipio: body.id_municipio,
        nombre: body.nombre,
        contratista: body.contratista,
        contrato: body.contrato,
        contrato_obra: body.contrato_obra,
        tipo: body.tipo
    });

    proyecto.save((err, proyectoGuardar) => {

        if (err) {
            return res.status(400).json({
                ok: true,
                mensaje: 'Error al crear el proyecto',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            proyecto: proyectoGuardar
        });

    });

});


//Actualizar Proyecto
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Proyecto.findById(id, (err, proyecto) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el proyecto',
                errors: err
            });
        }

        if (!proyecto) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El proyecto con el id' + id + ' no existe',
                errors: { menssage: 'No existe el proyecto con ese id' }
            });
        }

        proyecto.id_municipio = body.id_municipio;
        proyecto.nombre = body.nombre;
        proyecto.contratista = body.contratista;
        proyecto.contrato = body.contrato;
        proyecto.contrato_obra = body.contrato_obra;
        proyecto.tipo = body.tipo;


        proyecto.save((err, proyectoGuardar) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el proyecto',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                proyecto: proyectoGuardar
            });

        });

    });
});


//Eliminar Proyecto
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Proyecto.findByIdAndRemove(id, (err, proyectoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el proyecto',
                errors: err
            });
        }

        if (!proyectoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe el proyecto con ese id',
                errors: { menssage: 'No existe el proyecto' }
            });
        }

        res.status(200).json({
            ok: true,
            proyecto: proyectoBorrado
        });

    });

});

module.exports = app;