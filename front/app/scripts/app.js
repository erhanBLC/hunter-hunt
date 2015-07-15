'use strict';


angular
  .module('HunterHuntApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'HunterHuntConstants',
    'angular-loading-bar',
    '720kb.tooltips'
  ])

.config(function ($routeProvider, $locationProvider, cfpLoadingBarProvider) {

    cfpLoadingBarProvider.includeSpinner = false;

    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        })

        .when('/search/:word', {
            templateUrl: 'views/search.html',
            controller: 'SearchCtrl'
        })

        .when('/about', {
            templateUrl: 'views/about.html',
            controller: 'AboutCtrl'
        })

        .when('/tips', {
            templateUrl: 'views/tips.html',
            controller: 'TipsCtrl'
        })

        .when('/ranking', {
            templateUrl: 'views/ranking.html',
            controller: 'RankingCtrl'
        })

        .when('/:hunter', {
            templateUrl: 'views/hunter.html',
            controller: 'HunterCtrl'
        })

        .otherwise({
            redirectTo: '/'
        });

        $locationProvider.html5Mode(true);

});
