'use strict';

angular

.module('HunterHuntApp')


.controller('MainCtrl', function($scope, $location, $http, SERVER){

    function random_obj(obj) {
        var result;
        var count = 0;
        for (var prop in obj)
            if (Math.random() < 1/++count)
                result = prop;
        return result;
    }

    $scope.searchword = function(keyword){ $location.path( sprintf('/search/%s', keyword) ); }

    $http({
        url: SERVER.METHOD+SERVER.API+SERVER.PORT+"/hunters/_design/words/_view/random",
        params: {
            startkey: Math.random(),
            limit: 1
        }
    }).success(function(data){
        var words = data.rows[0].value;
        var random = Array();
        for(var i=0; i<10; i++ ) {
                var obj = random_obj(words);
                random.push(obj);
                delete words[obj];
            }
            $scope.words = random;
        });

});
