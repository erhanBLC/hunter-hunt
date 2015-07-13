'use strict';

angular

.module('HunterHuntApp')


.controller('HunterCtrl', function($scope, $routeParams, SERVER, $http, $location){

    function dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

    function numberWithCommas(x) { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

    $http({
        url: SERVER.METHOD+SERVER.API+SERVER.PORT+"/hunters/_design/list/_view/by_username",
        params: {
            key: sprintf("\"%s\"", $routeParams.hunter.toLowerCase())
        }

    }).success(function(data){
        var rows = data.rows
        if(rows.length == 0) $location.path('/');
        else {
            var hunter = rows[0].value;
            hunter.average = numberWithCommas(Math.round(hunter.votes_count/hunter.posts_count));
            hunter.posts_count = numberWithCommas(hunter.posts_count);
            hunter.votes_count = numberWithCommas(hunter.votes_count);
            $scope.hunter = hunter;

            var words = rows[0].value.words;
            var tmp_words = Array();
            for(var i in words) tmp_words.push({"word":i, "nb":words[i]});
            $scope.words = tmp_words.sort(dynamicSort("nb")).reverse().slice(0,15);

            $scope.hunts = hunter.last_posts;
        }

    }).error(function(err){
        $location.path('/');
    });

});
