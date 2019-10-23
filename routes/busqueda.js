var express = require('express');

var app = express();

var Usuario = require('../models/usuario');

//Rutas
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarUsuario(busqueda, regex)
        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                usuarios: respuestas[2]
            });
        });

});


function buscarUsuario(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre apellido direccion telefono email sexo rol cedula')
            .or([{ 'nombre': regex }, { 'cedula': regex },{ 'apellido': regex },{ 'email': regex }])
            .exec((err, usuarios) => {

                if (err) {

                    reject('Error al cargar usuarios', err);

                } else {
                    resolve(usuarios);
                }

            });

    });

}


//busqueda especifica
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {

        case 'user':
            promesa = buscarUsuario(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son usuarios',
                error: { message: 'Tipo de tabla/coleccion no valida' }
            });



    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data

        });
    });


});

module.exports = app;