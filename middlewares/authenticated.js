//middleware que se ejecuta antes de entrar al controlador
const jwt = require('jwt-simple'); //libreria para la creacion de token
const moment = require('moment'); //idem
let secret = 'clave_secreta_app'; //palabra clave que hashea la password
//creamos el metodo que confirmara si los datos son correctos del token.
exports.ensureAuth = function (req, res, next) {
    //recoger el header de autenticacion y validarlo.
    if (!req.headers.authorization){
        return res.status(403).send({ message: 'La peticion no tiene la cabecera de autentificacion'})
    }
    //obtenemos y remplazamos los caracteres invalidos " & ' del token por nada ''
    let token = req.headers.authorization.replace(/["']+/g, '');
    //decodificar token
    try{
        //pasamos el token y la clave secreta para decodificar
        var payload = jwt.decode(token, secret);
        //si la fecha de expiracion es menor a la fecha actual del token
        if (payload.exp <= moment().unix()){
            return res.status(401).send({ message: 'El token a expirado'});
        }
    //si existe el error en la decodificacion obtenemos el error
    }catch (ex){
        //console.log(ex);
        return res.status(404).send({ message: 'El token no es valido'});
    }
    //devolvemos los datos del usuario
    req.user = payload;
    //salimos del middleware
    next();
};