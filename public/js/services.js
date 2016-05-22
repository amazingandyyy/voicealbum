'use strict';

var app = angular.module('albumApp');

app.service('Image', function($http) {
    this.getAll = () => {
        return $http({
            method: 'GET',
            url: '/api/image/'
        });
    }
    this.findOneAndUpdateAnalysis = (imageId, data) => {
        console.log('imageId from service: ', imageId);
        console.log('data from service: ', data);

        return $http({
            method: 'PUT',
            url: `/api/image/${imageId}`,
            data: data
        })

    }
});
