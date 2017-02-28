//llamar a mongoose para utilizar la bd
const mongoose = require('mongoose');
//ocupar la funcion schema
let Schema = mongoose.Schema;
//crear el schema
let UserSchema = Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    role: String,
    image: String
});
//exportar el modelo(nombre, modelo)
module.exports = mongoose.model('User', UserSchema);