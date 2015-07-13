'use strict';

angular

.module('HunterHuntApp')


.controller('SearchCtrl', function($scope, $http, SERVER, $location, $routeParams){

    $scope.searchword = function(keyword){ $location.path( sprintf('/search/%s', keyword) ); }

    function countWords(s){ return s.replace(/(^\s*)|(\s*$)/gi,"").replace(/[ ]{2,}/gi," ").replace(/\n /,"\n").split(' ').length; }

    if($routeParams.word){
        var keyword = $routeParams.word;
        $scope.keyword = keyword;

        $scope.hide = false;
        if(typeof keyword === 'undefined' || keyword.length < 2 || countWords(keyword) > 1){
            $scope.status = "Hey! The search must have one word with at least 2 characters";
            $scope.hide = false;
            $scope.hunters = [];

        } else {
            $scope.status = "";

            $http({
                url: SERVER.METHOD+SERVER.API+SERVER.PORT+"/hunters/_design/words/_view/all_occurrences",
                params: {
                    startkey: sprintf('["%s",{}]', keyword.toLowerCase()),
                    endkey: sprintf('["%s"]', keyword.toLowerCase()),
                    descending: true,
                    include_docs: true
                }

            }).success(function(data){
                var rows = data.rows;
                if(rows.length == 0) {
                    $scope.hunters = [];
                    $scope.status = "No result...";

                } else {
                    $scope.status = "";
                    $scope.hunters = rows;
                }

            }).error(function(err){
                $scope.status = "Something went wrong... try later!";
            });

            $scope.hide = true;

        }

        } else $location.path("/");
});
