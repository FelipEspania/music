const express = require('express');
const AlbumController = require('../controllers/album');
let api = express.Router();
let md_auth = require('../middlewares/authenticated');
let multipart = require('connect-multiparty');
let md_upload = multipart({ uploadDir: './uploads/album' });

api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.get('/albums/:artist', md_auth.ensureAuth, AlbumController.getAlbums);
api.post('/album-update', md_auth.ensureAuth, AlbumController.updateAlbum);

module.exports = api;