'use strict';

angular

.module('HunterHuntApp')


.controller('SearchCtrl', function($scope, $http, SERVER, $location, $routeParams){

    $scope.searchword = function(keyword){ $location.path( sprintf('/search/%s', keyword) ); }

    function countWords(s){ return s.replace(/(^\s*)|(\s*$)/gi,"").replace(/[ ]{2,}/gi," ").replace(/\n /,"\n").split(' ').length; }

    function giphy(word){
        $http({
            url: sprintf("http://api.giphy.com/v1/gifs/search?q=%s&api_key=dc6zaTOxFJmzC",word)
        }).success(function(data){

            var gif = data.data[Math.floor(Math.random()*data.data.length)];
            $scope.image = gif.images.fixed_height.url;

        }).error(function(err){
            $scope.status = no_result;
        });
    }

    function random_obj(obj) {
        var result;
        var count = 0;
        for (var prop in obj)
            if (Math.random() < 1/++count)
                result = prop;
        return result;
    }

    function tags(){
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
    }

    if($routeParams.word){
        var keyword = $routeParams.word;
        $scope.keyword = keyword;

        $scope.hide = false;
        if(typeof keyword === 'undefined' || keyword.length < 2 || countWords(keyword) > 1){
            $scope.status = "Hey! The search must have one word with at least 2 characters";
            giphy("cat");
            $scope.hide = false;
            $scope.hunters = [];
            tags();

        } else {
            $scope.status = "";

            $http({
                url: SERVER.METHOD+SERVER.API+SERVER.PORT+"/hunters/_design/words/_view/all_occurrences",
                params: {
                    startkey: sprintf('["%s",{}]', keyword.toLowerCase()),
                    endkey: sprintf('["%s"]', keyword.toLowerCase()),
                    descending: true,
                    limit: 22
                }

            }).success(function(data){
                var rows = data.rows;
                if(rows.length == 0) {

                    $scope.hunters = [];
                    var no_result = sprintf('No result for "%s"...', keyword);
                    $scope.status = no_result;
                    giphy("fail");
                    tags();

                } else {
                    $scope.status = "";
                    $scope.word = keyword;
                    if(rows.length >= 3){
                        $scope.top_hunters = rows.slice(0,3);
                        $scope.hunters = rows.slice(3,rows.length);
                    } else $scope.hunters = rows;
                }

            }).error(function(err){
                $scope.status = "Something went wrong... try later!";
                giphy("OMG");
                tags();
            });

            $scope.hide = true;

        }

        } else $location.path("/");
});
