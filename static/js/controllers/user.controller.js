'use strict';
angular.module('userController', ['modelService'])
.controller('UserController', function UserController ($scope, $rootScope, $http, APP_EVENTS, MODEL_PATHS, ModelService) {
  this.users = [];
  var self = this;
  console.log("User Controller Loaded");

  $scope.$on(APP_EVENTS.setUpComplete, function () {
    console.log("UC - SetUp Complete");
  });
  $scope.$on(APP_EVENTS.userUpdates, function (event, users) {
    self.users = users;
    console.log("UC - Users Loaded");
  });
});
