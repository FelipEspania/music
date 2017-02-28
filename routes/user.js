const express = require('express');
const UserController = require('../controllers/user'); //requiere el controlador correspondiente
let api = express.Router(); //Ocupar la funcion router de express
let md_auth = require('../middlewares/authenticated'); //cargamos el middleware creado
let multipart = require('connect-multiparty');

let md_upload = multipart({ uploadDir: './uploads/users'});

//creando las rutas y sus correspondientes controladores (comportamiento)
api.get('/probando', md_auth.ensureAuth, UserController.pruebas); //utilizando el middleware (2° parametro)
api.post('/register', UserController.saveUser); //registrar usuario
api.post('/login', UserController.loginUser); //logear usuario
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser); //actualizar usuario y se requiere autentificacion
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImages); //subir imagen de usuario
api.get('/get-image-user/:imageFile', UserController.getImageFile); //obtener la imagen de usuario

//exportar las rutas
module.exports = api;