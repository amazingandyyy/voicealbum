'use strict';

var mongoose = require('mongoose');
// var Image = require('./image');
// var io = require('socket.io')();

var albumSchema = new mongoose.Schema({
    name: {
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
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }]
});

albumSchema.statics.addPhoto = function(params, cb) {
    var albumId = params.albumId;
    var imageId = params.imageId;
    // console.log('albumId: ', albumId);
    // console.log('imageId: ', imageId);


    var promise = new Promise((resolve, reject) => {
        this.findById(albumId, (err, album) => {
            console.log('album:', album);
            if (err || !album || !imageId) {
                return reject(err || 'album not found');
            }
            // console.log('album.images.indexOf(imageId) === -1: ', album.images.indexOf(imageId) === -1);
            if (album.images.indexOf(imageId) === -1) {
                album.images.push(imageId);
                album.save(err => {
                    if (err) return reject(err);
                    resolve(album);
                })
            } else {
                reject('imageId already exists');
            }

        })
    })

    promise
        .then(album => {
            // console.log('check2');
            // console.log('imageId after check2: ', imageId);
            // console.log('check2.5');
            // here is not promise there is no resolve or reject...
            mongoose.model('Image').findById(imageId, (err, image) => {
                // console.log('check3');
                // console.log('imageimageimage: ', image);
                if (err) return cb(err);
                if (image.albums.indexOf(albumId) === -1) {
                    // console.log('check4');
                    image.albums.push(albumId);
                    image.save(err => {
                        if (err) return cb(err);
                        cb(null, {
                            album,
                            image
                        })
                    })
                } else {
                    cb(null, image)
                }
            })
        })
        .catch(err => {
            console.log('ERR:', err)
            cb(err)
        })
};



var Album = mongoose.model('Album', albumSchema);
module.exports = Album;
