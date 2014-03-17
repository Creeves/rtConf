'use strict';

angular.module('confApp')
  .controller('MainCtrl', ['$scope', '$location', function ($scope, $location) {
    
  	$scope.name = function(e) {
      var username;
      if (e === undefined || e == "") {
        username = 'user' + parseInt(Math.random()*1000000);
      } else {
        username = e;
      }
      $location.path('/conf').search('user', username);
    }
    $scope.join = function(e) {
      if (e.keyCode == 13) {
        $scope.name($scope.confname);
      }
    }
  }]);
