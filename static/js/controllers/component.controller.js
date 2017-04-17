'use strict';
angular.module('componentController', ['modelService'])
.controller('ComponentController', function ComponentController ($scope, $rootScope, $http, APP_EVENTS, MODEL_PATHS, ModelService) {
  this.components = [];
  var self = this;
  console.log("Component Controller Loaded");

  $scope.$on(APP_EVENTS.setUpComplete, function () {
    console.log("CPC - SetUp Complete");
  });
  
  $scope.$on(APP_EVENTS.componentUpdates, function (event, components) {
    self.components = components;
    console.log("CPC - components Loaded: " + JSON.stringify(self.components));
  });
});
