const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT || 8080;

mongoose.connect('mongodb://root:agrometallica@ds145639.mlab.com:45639/curso_mean2', (err, res) => {
    if (err){
        throw err;
    }else{
        console.log("Conectado a la base de datos");

        app.listen(port, function () {
            console.log("Servidor arriba en puerto " + port);
        });
    }
});

