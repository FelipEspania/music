//librerias para la creacion de token
const jwt = require('jwt-simple');
const moment = require('moment');
//palabra clave que hashea la password
let secret = 'clave_secreta_app';
//creamos el metodo que guardara los datos en el token
exports.createToken = function (user) {
    let payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(), //momento en que inicia sesion
        exp: moment().add(30, 'days').unix //momento en que expira sesion
    };

    return jwt.encode(payload, secret);
};