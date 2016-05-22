'use strict';

const express = require('express');
const router = express.Router();

let mongoose = require('mongoose');
let AWS = require('aws-sdk');
let uuid = require('uuid');
var request = require('request');
var Image = require('../models/image');

let bucketName = process.env.AWS_BUCKET;
let urlBase = process.env.AWS_URL_BASE;
let CVPkey = process.env.MSFT_CVP_KEY;


let s3 = new AWS.S3();


var multer = require('multer');
var upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        filesize: 1000000 * 10
    }
});

var Image = require('../models/image');

router.post('/', upload.single('newFile'), function(req, res) {
    console.log('req.file: ', req.file);
    Image.upload(req.file, (err, image) => {
        if (err) return console.log('err: ', err);
        res.status(err ? 400 : 200).send(err || image)
    })

    // var file = req.file;
    // if (!file.mimetype.match(/image/)) {
    //     return res.status(400).send('It must be image.')
    // }
    // let filenameParts = file.originalname.split('.');
    // let ext;
    // if (filenameParts.length > 1) {
    //     ext = "." + filenameParts.pop();
    // } else {
    //     ext = '';
    // }
    //
    // let key = `${uuid.v4()}${ext}`;
    //
    // let params = {
    //     Bucket: bucketName,
    //     Key: key,
    //     ACL: 'public-read-write',
    //     Body: file.buffer
    // }
    // s3.putObject(params, (err, result) => {
    //     if (err) return res.status(400).send(err);
    //     // console.log('result fron aws s3: ', result);
    //     // console.log('err: ', err);
    //     let imageUrl = `${urlBase}/${bucketName}/${key}`;
    //     console.log('imageUrl: ', imageUrl);
    //
    //     request({
    //         method: 'POST',
    //         url: `https://api.projectoxford.ai/vision/v1.0/analyze?visualFeatures=Categories,Description,Tags,Color`,
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Ocp-Apim-Subscription-Key': `${CVPkey}`
    //         },
    //         data: {
    //             'url': `${imageUrl}`
    //         }
    //     }, (err, res, body) => {
    //         if (err) console.log('err from oxford: ', err);
    //         console.log('res.data from oxford: ', body);
    //         Image.create({
    //             url: imageUrl,
    //             fileName: file.originalname,
    //             // analysis: res.data,
    //             detail: {
    //                 fileType: file.mimetype
    //             }
    //         })
    //         // res.status(err ? 400 : 200).send()
    //     })
    //
    // });

    // request('http://amazingandyyy.github.io/', (err, res, body)=>{
    //     console.log('yfydydydydy');
    //    console.log('err: ', err);
    // //    console.log('res: ', res);
    //    console.log('body: ', body);
    // })


});
router.put('/:imageId', (req, res) => {
    // update one image's details
    // console.log('req.params.imageId: ', );
    // console.log('req.body: ', req.body);
    var analysisData = req.body;
    Image.findById(req.params.imageId, (err, image) => {
        if (err || !image) return res.status(400).send(err || 'Image not found');
        console.log('image: ', image);
        image.analysis = analysisData;
        image.save((err, imageWithUpdatedAnalysis) => {
            res.status(err ? 400 : 200).send(err || imageWithUpdatedAnalysis);
        });
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
    console.log('req.params.id: ', req.params.id);
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
