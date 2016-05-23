'use strict';

var app = angular.module('albumApp');
var start = false;
var keyCode;
var reader;
var totalPhotos;

app.controller('mainCtrl', function($scope, $timeout, Image, $location, $stateParams, $http, $state) {
    reader = 'UK English Male';
    console.log('mainCtrl loaded');
    $scope.start = () => {
        start = !start;
        $scope.quoteActived = !$scope.quoteActived
    }
    $scope.webcamStarted = false;

    var initial = 0;
    var over = 0;
    var share = 0;
    var AlbumArr = [];
    var pageIndex;
    $scope.keypress = (key) => {
        $scope.initializeVoiceAlbumComplete = false;
        $scope.initializeVoiceAlbumCompleteOut = false;
        keyCode = key.keyCode;
        console.log('keyCode: ', key.keyCode);
        if (keyCode === 113) {
            responsiveVoice.speak(`Welcome, this is intorduction and tips for VoiceAlbum.
                                    Voice Album is world's first photo album designed for blind people.
                                    Long Press A for 3 seconds to turn on Voice Album.
                                    Once Voice Album is been turned on, press A, again to start to listen to the Album.
                                    When you are listening to photos, you can
                                    Press D to replay.
                                    Press S for next photo.
                                    After all, long press F for 3 seconds to turn off Voice Album.
                                    Press Tab and enter to share photo to Facebook.
                                    By the way, you cna Press 1 for female reader, or press 2 for male reader.
                                    Thanks for using VoiceAlbum. Hope you enjoy it.`,  `${reader}`);
        }
        if (keyCode === 97) {
            console.log('someone tends to initialize VoiceAlbum');
            initial += 97;
            console.log(initial);
        } else {
            initial = 0;
        }
        if (initial > 97 * 8 - 1) {
            responsiveVoice.speak(`You just turned on Voice Album.
                                You have ${totalPhotos} photos.
                                Press A to start listen to them.
                                If you want to turn off voice album, Long press F.
                                For more tips, just Press Q.
                                Enjoy it!`, `${reader}`);
            // responsiveVoice.speak(`You just turned on Voice Album.
            //                     Press A to start listen to the album.
            //                     Press F five timse to turned off and leave the album.
            //                     Enjoy it!`, "UK English Male");

            console.log('VoiceAlbum initialized');
            $scope.initializeVoiceAlbumComplete = true;
            $scope.quoteActived = true;
            $timeout(function() {
                $scope.initializeVoiceAlbumCompleteOut = true;
            }, 1300)
            $timeout(function() {
                start = true;
            }, 1000)
            console.log(initial);
            pageIndex = 0;

            if (start) {
                Image.getAll().then(res => {
                    console.log('ressss: ', res.data[0]._id);
                    res.data.forEach(image => {
                        if (AlbumArr.indexOf(image._id) == -1) {
                            AlbumArr.unshift(image._id);
                        }
                    })
                    if(AlbumArr.length === res.data.length){
                        $location.path(`photo/${AlbumArr[0]}`);
                    }
                    console.log(AlbumArr);

                }, err => {
                    console.log(err);
                })
            }
            console.log('keyCode2: ', keyCode);
            console.log('keyCode === 102: ', keyCode === '102');
        }
        if (keyCode === 102) {
            console.log('someone tends to turn off VoiceAlbum');
            over += 102;
            console.log(over);
        } else {
            over = 0;
        }
        if (over > 102 * 10 - 1) {
            console.log('VoiceAlbum initialized');
            $scope.initializeVoiceAlbumOver = true;
            $scope.quoteActived = false;
            responsiveVoice.speak('Turned off Voice Album . If you want to turn on again, just long press A for 3 seconds. See you next time.',  `${reader}`);
            $timeout(function() {
                $scope.initializeVoiceAlbumoverOut = true;
            }, 1300)
            $timeout(function() {
                start = false;
                $location.path(`photos`)
            }, 1000)
        }
        if (start && keyCode === 100) {
            console.log('next page');
            pageIndex++;
            var page = pageIndex % AlbumArr.length
            $location.path(`photo/${AlbumArr[page]}`)
        }
        if (start && keyCode === 115) {
            console.log('read again: ', $stateParams);
            var imageId = $stateParams.imageId;
            $http.get(`/api/image/${imageId}`).then(res => {
                var quote = res.data.analysis[0].description.captions[0].text;
                responsiveVoice.speak(quote,  `${reader}`);
            }, err => {
                console.log('err: ', err);
            })
        }
        if (start && keyCode === 122) {
            console.log('someone tends to share VoiceAlbum');
            share += 122;
            console.log(share);
        } else {
            share = 0;
        }
        if (start && keyCode === 49) {
            reader = 'US English Female';
            responsiveVoice.speak('Hi, this is Christina.', `${reader}`);
        } else {
            share = 0;
        }
        if (start && keyCode === 50) {
            reader = 'UK English Male';
            responsiveVoice.speak('Hi, this is John.', `${reader}`);
        } else {
            share = 0;
        }
        if (share > 122 * 3 - 1) {
            console.log('share');
            console.log('read again: ', $stateParams);
            var imageId = $stateParams.imageId;
            $http.get(`/api/image/${imageId}`).then(res => {
                share = 0;
                var title = res.data.analysis[0].description.captions[0].text;
                var imageUrl = res.data.url;
                var imageId = res.data._id;
                var abURL = $state.href($state.current.name, $state.params, {absolute: true})
                console.log('title: ', title);
                console.log('imageUrl: ', imageUrl);
                console.log('imageId: ', imageId);
                console.log('abURL: ', abURL);



            }, err => {
                console.log('err: ', err);
            })
        }
    }


    $scope.startWebCam = () => {
            $scope.webcamStarted = !$scope.webcamStarted;
        }
        // var webcamData;
        // $scope.onError = function(err) {
        //     console.log('err from webcam: ', err);
        // };
        // $scope.onStream = function(stream) {
        //     console.log('stream from webcam: ', stream);
        // };
        // $scope.onSuccess = function(data) {
        //     console.log('webcam onSuccess:', data);
        //     // console.log();
        //     webcamData = data;
        //     console.log('webcamData: ', webcamData);
        // };
        // $scope.myChannel = {
        //     videoHeight: 400,
        //     videoWidth: 300,
        //     video: webcamData
        // };
        // $scope.$watch('media', function(media) {
        //         console.log(media);
        //     });

});

app.controller('photosCtrl', function($scope, Upload, Image, $http, $timeout) {

    console.log('photosCtrl loaded');
    $scope.log = "";
    var imagesData = [];
    Image.getAll().then(res => {
        totalPhotos = res.data.length;
        $scope.analysis = [];
        $scope.analysis.accentColor = []
        $scope.analysis.dominantColor = []
        $scope.analysis.tags = []
        var tagArr = {};
        var tagArrFinal = {};
        console.log(res.data);
        imagesData = res.data;
        $scope.photos = imagesData.reverse();
        $scope.photos.forEach(img => {
            // console.log(img.analysis[0]);
            var color = img.analysis[0].color;
            // console.log('img.analysis[0].description.tags: ', img.analysis[0].description.tags);
            // console.log('mg.analysis[0].tags: ', );
            var tags = img.analysis[0].description.tags;
            // img.analysis[0].tags.forEach(tag => {
            //     if(tag.confidence > 0.8){
            //         tags.push(tag.name);
            //     }
            // });
            // console.log('tagsss: ', tags);
            if ($scope.analysis.accentColor.indexOf(color.accentColor) === -1) {
                $scope.analysis.accentColor.push(color.accentColor)
            }
            if ($scope.analysis.dominantColor.indexOf(color.dominantColorBackground) === -1) {
                $scope.analysis.dominantColor.push(color.dominantColorBackground)
            }
            if ($scope.analysis.dominantColor.indexOf(color.dominantColorForeground) === -1) {
                $scope.analysis.dominantColor.push(color.dominantColorForeground)
            }

            tags.forEach(tag => {
                if (!tagArr[tag]) {
                    tagArr[tag] = 1;
                } else {
                    tagArr[tag] += 1;
                }
            })

            // console.log('tagArr: ', tagArr);

            function sortObject(obj) {
                var arr = [];
                var prop;
                for (prop in obj) {
                    if (obj.hasOwnProperty(prop) && obj[prop] > 1) {
                        arr.unshift({
                            'key': prop,
                            'value': obj[prop]
                        });
                    }
                }
                arr.sort(function(a, b) {
                    return a.value - b.value;
                });
                return arr;
            }
            var sorttedTagArr = [];
            var sorttedTagArr = sortObject(tagArr).reverse();
            // console.log(sorttedTagArr);

            $scope.analysis.tags = sorttedTagArr;
        })

    }, err => {
        if (err) return console.log('err: ', err);
    });


    // $scope.photos = photos;
    $scope.uploadFiles = (files) => {
        $scope.loader = 0;
        if (files.length > 0) {
            files.forEach(file => {
                // console.log(file);
                $timeout(function() {
                    $scope.loader += 70 * (1 / files.length) * Math.random();
                }, 200);
                Upload.upload({
                        url: '/api/image',
                        data: {
                            newFile: file
                        }
                    })
                    .then(res => {

                        imagesData.unshift(res.data);
                        // var index = imagesData.indexOf(res.data);
                        // console.log(index);

                        let CVPkey = 'f6eca23640c145bf95cf6784b8e24652';
                        var imageUrl = res.data.url;
                        var imageId = res.data._id;
                        $http({
                            method: 'POST',
                            url: `https://api.projectoxford.ai/vision/v1.0/analyze?visualFeatures=Tags,Color,Description`,
                            headers: {
                                'Content-Type': 'application/json',
                                'Ocp-Apim-Subscription-Key': `${CVPkey}`
                            },
                            data: {
                                'url': `${imageUrl}`
                            }
                        }).then(res => {
                            // console.log('res from oxford: ', res.data);
                            Image.findOneAndUpdateAnalysis(imageId, res.data).then(function(res) {
                                console.log('imageWithUpdatedAnalysis: ', res);
                                // imagesData.splice(index,1);
                                // imagesData.unshift(res.data);
                                var res = 100 - $scope.loader;
                                console.log('resss: ', res);
                                $scope.loader += res * (1 / files.length) + 20;
                                console.log($scope.loader);
                                Image.getAll().then(res => {
                                    $scope.analysis = [];
                                    $scope.analysis.accentColor = []
                                    $scope.analysis.dominantColor = []
                                    $scope.analysis.tags = []
                                    var tagArr = {};
                                    var tagArrFinal = {};
                                    console.log(res.data);
                                    imagesData = res.data;
                                    // $scope.photos = imagesData.reverse();
                                    $scope.photos.forEach(img => {
                                        console.log(img.analysis[0]);
                                        var color = img.analysis[0].color;
                                        var tags = img.analysis[0].description.tags;
                                        if ($scope.analysis.accentColor.indexOf(color.accentColor) === -1) {
                                            $scope.analysis.accentColor.push(color.accentColor)
                                        }
                                        if ($scope.analysis.dominantColor.indexOf(color.dominantColorBackground) === -1) {
                                            $scope.analysis.dominantColor.push(color.dominantColorBackground)
                                        }
                                        if ($scope.analysis.dominantColor.indexOf(color.dominantColorForeground) === -1) {
                                            $scope.analysis.dominantColor.push(color.dominantColorForeground)
                                        }

                                        tags.forEach(tag => {
                                            if (!tagArr[tag]) {
                                                tagArr[tag] = 1;
                                            } else {
                                                tagArr[tag] += 1;
                                            }
                                        })

                                        console.log('tagArr: ', tagArr);

                                        function sortObject(obj) {
                                            var arr = [];
                                            var prop;
                                            for (prop in obj) {
                                                if (obj.hasOwnProperty(prop) && obj[prop] > 1) {
                                                    arr.unshift({
                                                        'key': prop,
                                                        'value': obj[prop]
                                                    });
                                                }
                                            }
                                            arr.sort(function(a, b) {
                                                return a.value - b.value;
                                            });
                                            return arr;
                                        }
                                        var sorttedTagArr = [];
                                        var sorttedTagArr = sortObject(tagArr).reverse();
                                        console.log(sorttedTagArr);

                                        $scope.analysis.tags = sorttedTagArr;
                                    })

                                }, err => {
                                    if (err) return console.log('err: ', err);
                                });
                            })

                        }, err => {
                            console.log('err from oxford: ', err);
                        })

                    }, err => {
                        console.log('err: ', err);
                    }, evt => {
                        console.log('evt.loaded: ', evt.loaded);
                        // console.log('evt.total: ', evt.total);
                    })
            })
        }
    }


    $scope.filterByColor = (color) => {
        console.log('color: ', color);
        if (color === 'all') {
            $scope.searchFilterByColor = '';
            console.log('show all color');
        } else {
            console.log('filter by color: ', color);
            $scope.searchFilterByColor = `${color}`
        }

    }
    $scope.filterByTag = (tag) => {
        if (tag === 'all') {
            $scope.searchFilterByTags = '';
            console.log('show all tags');

        } else {
            console.log('filter by tag: ', tag);
            $scope.searchFilterByTags = `${tag}`
        }
    }


});



app.controller('photoCtrl', function($stateParams, $http, $scope, $location, $timeout) {
    console.log('photoCtrl loaded');
    console.log('start: ', start);
    $scope.responsiveVoice = responsiveVoice;
    $scope.speak = function(item) {
        responsiveVoice.speak(item, `${reader}`);
    }
    console.log('y');
    var imageId = $stateParams.imageId;
    $scope.photo = '';
    $scope.analysis = [];
    $scope.analysis.tags = [];
    $scope.analysis.alltags = [];

    $http.get(`/api/image/${imageId}`).then(res => {
        console.log('res: ', res.data);
        $scope.photo = res.data;
        // var tagsArr = .filter(tag=>{
        //     tag.confidence > 0.6;
        // })
        res.data.analysis[0].tags.sort().forEach(tag => {
            if (tag.confidence > 0.7) {
                $scope.analysis.tags.push(tag.name);
            }
        })
        res.data.analysis[0].description.tags.forEach(tag => {
            // console.log(tag);
            $scope.analysis.alltags.push(tag);
        })
        var item;
        if (start) {
            item = res.data.analysis[0].description.captions[0].text;
            responsiveVoice.speak(item, `${reader}`);
        }
        $scope.myModel = {
            Url: '',
            Name: "AngularJS directives for social sharing buttons - Facebook, Google+, Twitter and Pinterest | Jason Watmore's Blog",
            ImageUrl: 'http://www.jasonwatmore.com/pics/jason.jpg'
        };







    }, err => {
        console.log('err: ', err);
    })
    $scope.deletePhoto = (id) => {
        console.log('id: ', id);
        $http.delete(`/api/image/${imageId}`).then(res => {
            $location.url('/photos')
        }, err => {
            console.log('err: ', err);
        })
    }





});




app.controller('albumsCtrl', function($scope) {
    console.log('albumsCtrl loaded');
    var albums = [{
        name: "Album1",
        photos: [{
            url: "http://s.hswstatic.com/gif/10-breathtaking-views-1-orig.jpg"
        }, {
            url: "http://www.travelandleisure.com/sites/default/files/styles/tnl_redesign_article_landing_page/public/201403-w-restaurant-views-sierra-mar.jpg?itok=RZ_RtsPH"
        }, {
            url: "http://www.windows-8-wallpapers.com/thumbs/scenic-lake-feature-windows-8-wallpaper-t2.jpg"
        }, {
            url: "http://cdn.concreteplayground.com/v3/wp-content/uploads/2013/09/Views-1.jpg"
        }, {
            url: "http://www.eagleview.com.au/_assets/img/testimonials/Testimonial-3.jpg"
        }, {
            url: "http://www.travelandleisure.com/sites/default/files/styles/tnl_redesign_article_landing_page/public/201403-w-restaurant-views-sierra-mar.jpg?itok=RZ_RtsPH"
        }, {
            url: "http://www.windows-8-wallpapers.com/thumbs/scenic-lake-feature-windows-8-wallpaper-t2.jpg"
        }, {
            url: "http://cdn.concreteplayground.com/v3/wp-content/uploads/2013/09/Views-1.jpg"
        }, {
            url: "http://www.eagleview.com.au/_assets/img/testimonials/Testimonial-3.jpg"
        }]
    }, {
        name: "Album2",
        photos: [{
            url: "http://s.hswstatic.com/gif/10-breathtaking-views-1-orig.jpg"
        }, {
            url: "http://www.travelandleisure.com/sites/default/files/styles/tnl_redesign_article_landing_page/public/201403-w-restaurant-views-sierra-mar.jpg?itok=RZ_RtsPH"
        }, {
            url: "http://www.windows-8-wallpapers.com/thumbs/scenic-lake-feature-windows-8-wallpaper-t2.jpg"
        }, {
            url: "http://cdn.concreteplayground.com/v3/wp-content/uploads/2013/09/Views-1.jpg"
        }, {
            url: "http://www.eagleview.com.au/_assets/img/testimonials/Testimonial-3.jpg"
        }, {
            url: "http://www.travelandleisure.com/sites/default/files/styles/tnl_redesign_article_landing_page/public/201403-w-restaurant-views-sierra-mar.jpg?itok=RZ_RtsPH"
        }, {
            url: "http://www.windows-8-wallpapers.com/thumbs/scenic-lake-feature-windows-8-wallpaper-t2.jpg"
        }, {
            url: "http://cdn.concreteplayground.com/v3/wp-content/uploads/2013/09/Views-1.jpg"
        }]
    }, {
        name: "Album3",
        photos: [{
            url: "http://s.hswstatic.com/gif/10-breathtaking-views-1-orig.jpg"
        }, {
            url: "http://www.travelandleisure.com/sites/default/files/styles/tnl_redesign_article_landing_page/public/201403-w-restaurant-views-sierra-mar.jpg?itok=RZ_RtsPH"
        }, {
            url: "http://www.windows-8-wallpapers.com/thumbs/scenic-lake-feature-windows-8-wallpaper-t2.jpg"
        }, {
            url: "http://cdn.concreteplayground.com/v3/wp-content/uploads/2013/09/Views-1.jpg"
        }, {
            url: "http://www.eagleview.com.au/_assets/img/testimonials/Testimonial-3.jpg"
        }, {
            url: "http://www.travelandleisure.com/sites/default/files/styles/tnl_redesign_article_landing_page/public/201403-w-restaurant-views-sierra-mar.jpg?itok=RZ_RtsPH"
        }, {
            url: "http://www.windows-8-wallpapers.com/thumbs/scenic-lake-feature-windows-8-wallpaper-t2.jpg"
        }, {
            url: "http://cdn.concreteplayground.com/v3/wp-content/uploads/2013/09/Views-1.jpg"
        }, {
            url: "http://www.eagleview.com.au/_assets/img/testimonials/Testimonial-3.jpg"
        }]
    }]
    $scope.albums = albums;
});
app.controller('albumCtrl', function($http, $scope) {
    console.log('albumCtrl loaded');
});
