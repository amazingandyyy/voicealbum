const express = require('express');
const router = express.Router();
var Image = require('../models/image');
var uuid = require('uuid');

router.post('/', (req, res) => {
    var b64str = req.body ;
    // console.log('webcam body:', req.body);

    var buf = new Buffer(b64str, 'base64');
    console.log('webcam buf:', buf);
    // Image.upload(req.file, (err, image) => {
    //     if (err) return console.log('err: ', err);
    //     res.status(err ? 400 : 200).send(err || image)
    // })
    // Album.create(req.body, (err, album) => {
    //         res.status(err ? 400 : 200).send(err || album)
    //     });
});
module.exports = router;
