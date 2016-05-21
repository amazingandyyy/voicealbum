'use strict';

const express = require('express');
const router = express.Router();

var multer = require('multer');
var upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        filesize: 1000000 * 10
    }
});

var Image = require('../models/image');

router.post('/', upload.single('newFile'), function(req, res) {
    // console.log('req.file: ', req.file);
    Image.upload(req.file, (err, image) => {
        if (err) return console.log('err: ', err);
        res.status(err ? 400 : 200).send(err || image)
    })
});
router.put('/:id', (req, res) => {
    // update one image's details
    Image.findByIdAndUpdate(req.params.id, req.body)
        .exec((err, image) => {
            res.status(err ? 400 : 200).send(err || image)
        })
});
router.get('/', (req, res) => {
    // get all images
    Image.find({})
        .populate('albums')
        .exec((err, images) => {
            res.status(err ? 400 : 200).send(err || images)
        })
});
router.get('/:id', (req, res) => {
    // get one image by id
    console.log('req.params.id: ' ,req.params.id);
    Image.findById(req.params.id)
        .populate('albums')
        .exec((err, image) => {
            res.status(err ? 400 : 200).send(err || image)
        })
});
router.delete('/', (req, res) => {
    // remove one image by id
    Image.remove({})
        .exec((err) => {
            res.status(err ? 400 : 200).send(err);
        })
});
router.delete('/:id', (req, res) => {
    // remove one image by id
    Image.findByIdAndRemove({
            '_id': req.params.id
        })
        .exec((err) => {
            res.status(err ? 400 : 200).send(err);
        })
});

router.post('/:imageId/add/:albumId', (req, res) => {
    console.log('req.params', req.params);
    // create one album with name and photos
    Image.addToAlbum(req.params, (err, data) => {
        res.status(err ? 400 : 200).send(err || data)
    })
});

module.exports = router;
