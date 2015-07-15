'use strict';

angular

.module('HunterHuntApp')


.controller('RankingCtrl', function($scope, SERVER, $http, $location){
    $scope.Math = Math;
    $scope.format = function formatk(num) { return num > 999 ? (num/1000).toFixed(0) + 'k' : num };

    function order_by(view){

        if(view == "by_votes_count"){
            $scope.selectedVotes = 1;
            $scope.selectedHunts = 0;
            $scope.selectedAverage = 0;
        } else if(view == "by_posts_count"){
            $scope.selectedVotes = 0;
            $scope.selectedHunts = 1;
            $scope.selectedAverage = 0;
        } else if(view == "by_average_votes"){
            $scope.selectedVotes = 0;
            $scope.selectedHunts = 0;
            $scope.selectedAverage = 1;
        }

        $http({
            url: SERVER.METHOD+SERVER.API+SERVER.PORT+"/hunters/_design/list/_view/"+view,
            params: {
                descending: true
            }
        }).success(function(data){
            var rows = data.rows
            if(rows.length == 0) $location.path('/');
            else {
                $scope.top_hunters = rows.slice(0,3);
                $scope.hunters = rows.slice(3,rows.length);
            }
        }).error(function(err){
            $location.path('/');
        });
    }

    order_by("by_average_votes");

    $scope.votes = function order_by_votes(){
        order_by("by_votes_count");
    }
    $scope.posts = function order_by_posts(){
        order_by("by_posts_count");
    }
    $scope.average = function order_by_average() {
        order_by("by_average_votes");
    }
});
