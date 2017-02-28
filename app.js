const express = require('express');
const bodyParser = require('body-parser');

let app = express();

//cargar las rutas
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configurar cabeceras http

//carga de rutas base
app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);

app.get('/pruebas', function (req, res) {
    res.status(200).send({message: 'Welcome to hell' });
});

module.exports = app;