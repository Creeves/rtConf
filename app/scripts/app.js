'use strict';

angular.module('confApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/conf', {
        templateUrl: 'views/conf.html',
        controller: 'ConfCtrl'
      })
      .when('/chat', {
        templateUrl: 'views/chat.html',
        controller: 'ChatCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
