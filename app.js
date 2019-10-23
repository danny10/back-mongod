//Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

const port = process.env.PORT || 3000;

//Inicializar variables
var app = express();


//cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});


// body parse
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());



//Importar rutas
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var busquedaRoutes = require('./routes/busqueda');
var rolesRoutes = require('./routes/roles');
var contratoRoutes = require('./routes/contrato');
var facturaRoutes = require('./routes/factura');
var estadoRoutes = require('./routes/estado');
var tipoRoutes = require('./routes/tipo');
var departamentoRoutes = require('./routes/departamento');
var municipioRoutes = require('./routes/municipio');
var empresaRoutes = require('./routes/empresa');
var compromisoRoutes = require('./routes/compromiso');
var proyectoRoutes = require('./routes/proyecto');

//Conexion a la base de datos local
// mongoose.connection.openUri('mongodb://localhost:27017/proyectoDB', (err, res) => {

//     if (err) throw err;
//     console.log('Basde de datos: \x1b[32m%s\x1b[0m', 'online');
// });


//conexion a mongood atlas
mongoose.connection.openUri('mongodb+srv://admin:sYutcnqpiaRMO0ZT@proyectodb-yvmdj.mongodb.net/proyectoDB', { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {

        if (err) throw err;
        console.log('Basde de datos: \x1b[32m%s\x1b[0m', 'online');
    });


//rutas
app.use('/usuario', usuarioRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/login', loginRoutes);
app.use('/contrato', contratoRoutes);
app.use('/role', rolesRoutes);
app.use('/factura', facturaRoutes);
app.use('/estado', estadoRoutes);
app.use('/tipo', tipoRoutes);
app.use('/departamento', departamentoRoutes);
app.use('/municipio', municipioRoutes);
app.use('/empresa', empresaRoutes);
app.use('/compromiso', compromisoRoutes);
app.use('/proyecto', proyectoRoutes);

//escuchar peticiones
app.listen(port, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online ');
});