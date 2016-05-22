'use strict';

var app = angular.module('albumApp');

app.controller('mainCtrl', function($scope, $timeout) {
    console.log('mainCtrl loaded');


});
app.controller('photosCtrl', function($scope, Upload, Image) {
    console.log('photosCtrl loaded');
    $scope.log = "";
    var imagesData = [];
    Image.getAll().then(res => {
        console.log(res.data);
        imagesData = res.data;
        $scope.photos = imagesData.reverse();
    }, err => {
        if (err) return console.log('err: ', err);
    });
    // $scope.photos = photos;
    $scope.uploadFiles = (files) => {
        if (files.length > 0) {
            files.forEach(file => {
                console.log(file);
                Upload.upload({
                        url: '/api/image',
                        data: {
                            newFile: file
                        }
                    })
                    .then(res => {
                        console.log('res: ', res);
                        console.log('res.data: ', res.data);
                        imagesData.unshift(res.data);
                        console.log('imagesData: ', imagesData);

                        console.log('imageUrl: ', imageUrl);
                        console.log('CVPkey: ', CVPkey);
                        $http({
                            method: 'POST',
                            url: `https://api.projectoxford.ai/vision/v1.0/analyze?visualFeatures=Tags,Color`,
                            headers: {
                                'Content-Type': 'application/json',
                                'Ocp-Apim-Subscription-Key': `${CVPkey}`
                            },
                            data: {
                                'url': `${imageUrl}`
                            }

                        }).then(res => {
                            console.log('res from oxford: ', res.data);
                        }, err => {
                            console.log('err from oxford: ', err);
                        })



                    }, err => {
                        console.log('err: ', err);
                    }, evt => {
                        console.log('evt.loaded: ', evt.loaded);
                        console.log('evt.total: ', evt.total);
                    })
            })
        }
    }


    $scope.analyze = (imageUrl) => {
        // var imageUrl = $scope.photo.url;

    }


});



app.controller('photoCtrl', function($stateParams, $http, $scope, $location) {
    console.log('photoCtrl loaded');
    var imageId = $stateParams.imageId;
    $scope.photo = '';

    $http.get(`/api/image/${imageId}`).then(res => {
        console.log('res: ', res.data);
        $scope.photo = res.data;
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
