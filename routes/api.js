var express = require('express');
var router = express.Router();

var Image = require('../models/image');
var Album = require('../models/album');

/* GET users listing. */
router.use('/album', require('./album'));
router.use('/image', require('./image'));
router.use('/webcam', require('./webcam'));

module.exports = router;
