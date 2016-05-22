'use strict';

let mongoose = require('mongoose');
let AWS = require('aws-sdk');
let uuid = require('uuid');
var request = require('request');
// var http = require('http');
// var https = require('https');

let s3 = new AWS.S3();

let imageSchema = new mongoose.Schema({
    url: {
        type: String
    },
    createAt: {
        type: Date,
        data: new Date
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    fileName: {
        type: String
    },
    analysis: [],
    detail: [],
    albums: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album'
    }]
});

let bucketName = process.env.AWS_BUCKET;
let urlBase = process.env.AWS_URL_BASE;
let CVPkey = process.env.MSFT_CVP_KEY;

imageSchema.statics.upload = (file, cb) => {
    if (!file.mimetype.match(/image/)) {
        return cb({
            error: 'File must be image'
        })
    }
    let filenameParts = file.originalname.split('.');
    let ext;
    if (filenameParts.length > 1) {
        ext = "." + filenameParts.pop();
    } else {
        ext = '';
    }

    let key = `${uuid.v4()}${ext}`;

    let params = {
        Bucket: bucketName,
        Key: key,
        ACL: 'public-read-write',
        Body: file.buffer
    }
    console.log('params: ', params);
    s3.putObject(params, (err, result) => {
        if (err) return cb(err);
        console.log('result fron aws s3: ', result);
        console.log('err: ', err);
        let imageUrl = `${urlBase}/${bucketName}/${key}`;
        console.log('imageUrl: ', imageUrl);

        // request({
        //     method: 'POST',
        //     url: `https://api.projectoxford.ai/vision/v1.0/analyze?visualFeatures=Categories,Description,Tags,Color`,
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Ocp-Apim-Subscription-Key': `${CVPkey}`
        //     },
        //     data: {
        //         'url': `${imageUrl}`
        //     }
        // }, (err, res, body) => {
        //     if (err) return console.log('err from oxford: ', err);
        //     console.log('res: ', body);
        //     console.log('res.data from oxford: ', res.data);
        Image.create({
                url: imageUrl,
                fileName: file.originalname,
                // analysis: res.data,
                detail: {
                    fileType: file.mimetype
                }
            }, cb)
            // })
    });
};









imageSchema.statics.addToAlbum = (params, cb) => {
    var albumId = params.albumId;
    var imageId = params.imageId;
    // console.log('albumId: ', albumId);
    console.log('imageId2: ', imageId);
    new Promise((resolve, reject) => {
            this.findById(imageId, (err, image) => {
                // console.log('image: ', image);
                if (err || !image) {
                    // console.log('hi2 - err');
                    reject(err || 'image not found')
                } else {
                    console.log('image: ', image);
                    if (image.albums.indexOf(albumId) === -1) {
                        // console.log('yopppooo');

                        image.albums.push(albumId);
                        image.save(err => {
                            if (err) reject(err);
                            resolve(image)
                        })
                    } else {
                        reject('albumId already exists');
                    }
                }
            })
        })
        .then(image => {
            // console.log('yopppooo');
            // here is not promise there is no resolve or reject...
            mongoose.model("Album").findById(albumId, (err, album) => {
                if (err) return cb(err);
                // console.log('album: ', album);
                // console.log('album.images: ', album.images);
                if (album.images.indexOf(imageId) === -1) {
                    album.images.push(imageId);
                    album.save(err => {
                        if (err) return cb(err);
                        cb(null, {
                            album,
                            image
                        })
                    })
                } else {
                    cb(err)
                }
            })
        })
        .catch(err => {
            // console.log('hi3');
            cb(err)
        })
};









var Image = mongoose.model('Image', imageSchema);
module.exports = Image;
