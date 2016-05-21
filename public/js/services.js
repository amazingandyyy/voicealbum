'use strict';

var app = angular.module('albumApp');

app.service('Image', function($http) {
    this.getAll = () => {
        return $http({
            method: 'GET',
            url: '/api/image/'
        });
    }
});
