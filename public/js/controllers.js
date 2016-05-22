'use strict';

var app = angular.module('albumApp');

app.controller('mainCtrl', function($scope, $timeout, Image, $location) {
    console.log('mainCtrl loaded');
    var keyCode;
    var initial = 0;
    var over = 0;
    var start = false;
    var AlbumArr = [];
    var pageIndex;
    $scope.keypress = (key) => {
        $scope.initializeVoiceAlbumComplete = false;
        $scope.initializeVoiceAlbumCompleteOut = false;
        keyCode = key.keyCode;
        console.log('keyCode: ', key.keyCode);
        if (keyCode === 118) {
            console.log('someone tends to initialize VoiceAlbum');
            initial += 118;
            console.log(initial);
        } else {
            initial = 0;
        }
        if (initial > 1200) {
            console.log('VoiceAlbum initialized');
            $scope.initializeVoiceAlbumComplete = true;
            $timeout(function() {
                $scope.initializeVoiceAlbumCompleteOut = true;
            }, 1300)
            $timeout(function() {
                start = true;
            }, 1000)
            console.log(initial);
            start = true;
            pageIndex = 0;

            if (start) {
                Image.getAll().then(res => {
                    res.data.forEach(image => {
                        if(AlbumArr.indexOf(image._id)==-1){
                            AlbumArr.push(image._id);
                        }
                    })
                    console.log(AlbumArr);
                    $location.path(`photo/${AlbumArr[0]}`)
                }, err => {
                    console.log(err);
                })
            }
            console.log('keyCode2: ', keyCode);
            console.log('start: ', start);
            console.log('keyCode === 102: ', keyCode === '102');

        }
        if (keyCode === 98) {
            console.log('someone tends to initialize VoiceAlbum');
            over += 98;
            console.log(initial);
        } else {
            over = 0;
        }
        if (over > 1100) {
            console.log('VoiceAlbum initialized');
            $scope.initializeVoiceAlbumOver = true;
            $location.path(`/photos`)
            $timeout(function() {
                $scope.initializeVoiceAlbumoverOut = true;
            }, 1300)
            $timeout(function() {
                start = false;
            }, 1000)
        }
        if(start && keyCode === 102){
            console.log('next page');

            pageIndex ++;
            // console.log('AlbumArr: ', );
            // console.log('pageIndex: ' ,);
            var page = pageIndex % AlbumArr.length
            $location.path(`photo/${AlbumArr[page]}`)
        }


    }



});
app.controller('photosCtrl', function($scope, Upload, Image, $http, $timeout) {



    console.log('photosCtrl loaded');
    $scope.log = "";
    var imagesData = [];
    Image.getAll().then(res => {
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
                                    $scope.photos = imagesData.reverse();
                                    $scope.tagValue = () => {

                                    }
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
                                // Image.getAll().then(res => {
                                //     $scope.analysis = [];
                                //     $scope.analysis.accentColor = []
                                //     $scope.analysis.dominantColor = []
                                //     $scope.analysis.tags = []
                                //     var tagArr = {};
                                //     var tagArrFinal = {};
                                //     console.log(res.data);
                                //     imagesData = res.data;
                                //
                                //     imagesData.forEach(img => {
                                //         // console.log(img.analysis[0]);
                                //         var color = img.analysis[0].color;
                                //         var tags = img.analysis[0].description.tags;
                                //         if ($scope.analysis.accentColor.indexOf(color.accentColor) === -1) {
                                //             $scope.analysis.accentColor.push(color.accentColor)
                                //         }
                                //         if ($scope.analysis.dominantColor.indexOf(color.dominantColorBackground) === -1) {
                                //             $scope.analysis.dominantColor.push(color.dominantColorBackground)
                                //         }
                                //         if ($scope.analysis.dominantColor.indexOf(color.dominantColorForeground) === -1) {
                                //             $scope.analysis.dominantColor.push(color.dominantColorForeground)
                                //         }
                                //
                                //         tags.forEach(tag => {
                                //             if (tag.confidence > 0.7) {
                                //                 if (!tagArr[tag.name]) {
                                //                     tagArr[tag.name] = 1;
                                //                 } else {
                                //                     tagArr[tag.name] += 1;
                                //                 }
                                //             }
                                //         })
                                //         $scope.analysis.tags = tagArr;
                                //     })
                                //
                                // }, err => {
                                //     if (err) return console.log('err: ', err);
                                // });

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



app.controller('photoCtrl', function($stateParams, $http, $scope, $location) {
    console.log('photoCtrl loaded');
    // var $scope.analysis = [];

    $scope.responsiveVoice = responsiveVoice;

    $scope.speak = function(item) {
        console.log(item);
        responsiveVoice.speak(item, "US English Female");
    }

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
        var item = res.data.analysis[0].description.captions[0].text;
        responsiveVoice.speak(item, "US English Female");
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

    // console.log($scope.photo.analysis[0].tags);

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
