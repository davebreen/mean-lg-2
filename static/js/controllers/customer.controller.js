'use strict';
angular.module('customerController', ['modelService'])
.controller('CustomerController', function CustomerController ($scope, $rootScope, $http, APP_EVENTS, MODEL_PATHS, ModelService) {
  this.customers = [];
  var self = this;
  console.log("Customer Controller Loaded");

  $scope.$on(APP_EVENTS.setUpComplete, function () {
    console.log("CTC - SetUp Complete");
  });

  $scope.$on(APP_EVENTS.customerUpdates, function (event, customers) {
    self.customers = customers;
    console.log("CTC - customers Loaded: " + JSON.stringify(self.customers));
  });
});
