const fs = require('fs');
const path = require('path');
const mongoosePaginate = require('mongoose-pagination');

let Artist = require('../models/artist');
let Album = require('../models/album');
let Song = require('../models/song');

function getAlbum(req, res) {
    let albumId = req.params.id;

    Album.findById(albumId).populate({ path: 'artist' }).exec(function (err, album) {
        if (err){
            res.status(500).send({ message: 'Error en el servidor' });
        }else {
            if (!album){
                res.status(404).send({ message: 'No existe album' });
            }else {
                res.status(200).send({ album });
            }
        }
    });
}

function saveAlbum(req, res) {
    let album = new Album();
    let params = req.body;

    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save(function (err, albumStored) {
        if (err){
            res.status(500).send({ message: 'Error en el servidor' });
        }else {
            if (!albumStored){
                res.status(404).send({ message: 'Erro al guardar album' });
            }else {
                res.status(200).send({ album: albumStored });
            }
        }
    });
}

function getAlbums(req, res) {
    let artistaId = req.params.artist;

    if (!artistaId){
        //Sacar todos los albums de la BD
        var find = Album.find({}).sort('title');
    }else {
        //Sacar todos los album de un artista concreto de la BD
        var find = Album.find({ artist: artistaId }).sort('year');
    }

    find.populate({ path: 'artist' }).exec(function (err, albums) {
        if (err){
            res.status(500).send({ message: 'Error en el servidor' });
        }else {
            if (!albums){
                res.status(404).send({ message: 'No hay albums' });
            }else {
                res.status(200).send({ albums });
            }
        }
    });

}

function updateAlbum(req, res) {
    let albumId = req.params.id;
    let update = req.body;
    
    Album.findByIdAndUpdate(albumId, update, function (err, albumUpdated) {
        if (err) {
            res.status(500).send({ message: "Error en la peticion" });
        }else{
            if (!albumUpdated) {
                res.status(404).send({ message: "No se encuentra album" });
            }else{
                res.status(200).send({ album: albumUpdated });
            }
        }
    });
}

function deleteAlbum(req, res){
    var albumId = req.params.id;
    
    Album.findByIdAndRemove(albumId, function (err, albumRemoved) {
        if (err){
            res.status(500).send({ message: "Error al borrar el album" });
        }else {
            if (!albumRemoved){
                res.status(404).send({ message: 'El album no ha sido eliminado'});
            }else {
                Song.find({ album: albumRemoved._id }).remove(function (err, songRemoved) {
                    if (err){
                        res.status(500).send({ message: "Error al borrar la cancion" });
                    }else {
                        if (!songRemoved){
                            res.status(404).send({ message: 'La cancion no ha sido eliminada'});
                        }else {
                            res.status(200).send({ album: albumRemoved });
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req, res) {
    let albumId = req.params.id;
    let file_name = 'No subido';

    if (req.files){
        let file_path = req.files.image.path;
        let file_split = file_path.split('\\');
        let file_name = file_split[2];

        let ext_split = file_name.split('\.');
        let file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            Album.findByIdAndUpdate(albumId, {image: file_name}, function (err, albumUpdated) {
                if (!albumUpdated){
                    res.status(404).send({ message: 'No se ha podido actualizar el album' });
                }else {
                res.status(200).send({ album: albumUpdated });
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

function getImageFile(req, res) {
    let imageFile = req.params.imageFile;
    let path_file = './uploads/album/'+imageFile;

    fs.exists(path_file, function(exists){
        if (exists){
            res.sendFile(path.resolve(path_file));
        }else {
            res.status(200).send({ message: 'No existe la imagen' });
        }
    });
}

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
};