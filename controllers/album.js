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
            if (!albumId) {
                res.status(404).send({ message: "No se encuentra album" });
            }else{
                res.status(200).send({ album: albumUpdated });
            }
        }
    });
};

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum
};