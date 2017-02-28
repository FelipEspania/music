const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt-nodejs'); //requiere para encriptar la password
const jwt = require('../services/jwt'); //requiere el servicio creado para el token

let User = require('../models/user'); //llamar al modelo antes creado

function pruebas (req, res) {
    res.status(200).send({
        message: 'Testeando una accion del controlador'
    });
}
//funcion para recibir e insertar datos a la BD
function saveUser(req, res) {
    let user = new User(); //crear objeto y asi poder darle los datos a insertar
    let params = req.body; //recoger los datos que se le esta mandando

    console.log(params);

    //recogiendo los datos que se le estan pasando
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_ADMIN';
    user.image = 'null';

    //para encriptar la password y guardar el usuario
    if (params.password){
        //se encripta la password
        bcrypt.hash(params.password, null, null, function (err, hash) {
            user.password = hash;
            //se comprueba que los campos no vienen vacios
            if (user.name !== null && user.surname !== null && user.email !== null){
                //se guarda el usuario y se verifica por si existen errores
                user.save(function(err, userStored){
                    if (err){
                        res.status(500).send({ message: 'Error al guardar el usuario' });
                    }else {
                        if (!userStored){
                            res.status(404).send({ message: 'No se a registrado error' });
                        }else {
                            res.status(200).send({ user: userStored });
                        }
                    }
                });
            }else {
                res.status(200).send({ message: 'rellena todos los campos' });
            }
        });
    }else{
        res.status(200).send({ message: 'introduce la contraseña' });
    }
}
//funcion para loguearse
function loginUser(req, res) {
    //recoger todos los parametros del body
    let params = req.body;
    //tomar el parametro email y password del body
    let email = params.email;
    let password = params.password;
    //buscar en la base de datos el email y comprobar si existe o no existe
    User.findOne({ email: email.toLowerCase() }, function (err, user) {
        if (err){
            res.status(500).send({ message: 'Error en la peticion' });
        }else {
            if (!user){
                res.status(404).send({ message: 'Usuario no existe' });
            }else {
                //comprobar contraseña
                bcrypt.compare(password, user.password, function (err, check) {
                    if (check){
                        //devolver los datos del usuario logueado
                        if (params.gethash){
                            //devolver un token de jwt
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        }else {
                            res.status(200).send({ user });
                        }
                    }else {
                        res.status(404).send({ message: 'Usuario no a podido logearse' });
                    }
                });
            }
        }
    });
}
//funcion para actualizar usuario
function updateUser(req, res) {
    //recogemos los datos atraves del body
    let userId = req.params.id;
    let update = req.body;
    //buscamos el usuario por el id, comprobamos errores y lo actualizamos
    User.findByIdAndUpdate(userId, update, function (err, userUpdated) {
        if (err){
            res.status(500).send({ message: 'Error al actualizar el usuario' });
        }else {
            if (!userUpdated){
                res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
            }else {
                res.status(200).send({ user: userUpdated });
            }
        }
    });
}
//funcion para subir imagenes
function uploadImages(req, res) {
    let userId = req.params.id; //obtenemos el id del usuario
    let file_name = 'No Subido...';

    if (req.files){ //si subio archivo
        let file_path = req.files.image.path; //obtiene la ruta de la imagen
        let file_split = file_path.split('\\'); //separa los nombres de la imagen
        let file_name = file_split[2];

        let ext_split = file_name.split('\.');
        let file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){ //si la extension del archivo es valida
            User.findByIdAndUpdate(userId, {image: file_name}, function (err, userUpdated) { //actualiza el usuario añadiendo la imagen del usuario
                if (!userUpdated){
                    res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
                }else {
                    res.status(200).send({ user: userUpdated });
                }
            });
        }else {
            res.status(200).send({ message: 'Extension de la imagen no valida' });
        }

        console.log(file_path);
    }else {
        res.status(200).send({ message: 'No has subido imagen' });
    }
}
//funcion para obtener imagen
function getImageFile(req, res) {
    let imageFile = req.params.imageFile; //obtenemos el nombre de la imagen
    let path_file = './uploads/users/'+imageFile; //obtenemos el archivo donde se encuentra la imagen

    fs.exists(path_file, function(exists){//verificamos si existe
        if (exists){
            res.sendFile(path.resolve(path_file)); //devolvemos la imagen
        }else {
            res.status(200).send({ message: 'No existe la imagen' });
        }
    });
}
//exportar las funciones para ocuparlas en las rutas
module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImages,
    getImageFile
};