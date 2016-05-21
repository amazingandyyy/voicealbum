'use strict';

var app = angular.module('albumApp');

app.controller('mainCtrl', function($http, $scope) {
    console.log('mainCtrl loaded');

});
app.controller('photosCtrl', function($http, $scope, Upload) {
    console.log('photosCtrl loaded');
    var photos = [{
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
        // $scope.photos = photos;
        // $scope.toggleAddPhoto = () => {
        //     console.log('yo');
        //     $scope.getModal = true;
        // }
        // $scope.closeModal = () => {
        //     $scope.getModal = false;
        // }
    $scope.uploadFiles = (files) => {
        console.log('files: ', files);
    }

});
app.controller('photoCtrl', function($http, $scope) {
    console.log('photoCtrl loaded');

});
app.controller('albumsCtrl', function($http, $scope) {
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
