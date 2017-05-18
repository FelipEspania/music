//llamar a mongoose para utilizar la bd
var mongoose = require('mongoose');
//ocupar la funcion schema
var Schema = mongoose.Schema;
//crear el schema
var UserSchema = Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    role: String,
    image: String
});
//exportar el modelo(nombre, modelo)
module.exports = mongoose.model('User', UserSchema);