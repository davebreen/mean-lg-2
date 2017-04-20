'use strict';
angular.module('mainController', [])
.controller('MainController', function MainController ($scope, $rootScope, $timeout, MODEL_PATHS, AUTH_PROPERTIES, APP_EVENTS, USER_ROLES, AuthService, ModelService) {
  this.currentUser = undefined;
  this.components = [];
  this.customers = [];
  this.appTitle = 'License Generator';
  var self = this;

  /** MAIN CONTROLLER FUNCTIONS **/
  this.setCurrentUser = function (user) {
    self.currentUser = user;
  };

  this.getRequests = function () {
    ModelService.get(MODEL_PATHS.licensePath, self.currentUser.authToken)
    .then(function(response) {
      console.log("MainC.SetUp: getLicenses: " + JSON.stringify(response.licenseRequestModels));
      $scope.$broadcast(APP_EVENTS.requestUpdates, response.licenseRequestModels);
    }, function (error) {
      console.log("MainC.SetUp: getLicenses FAILED: " + JSON.stringify(error));
    });
  };

  this.getUsers = function () {
    ModelService.get(MODEL_PATHS.userPath, self.currentUser.authToken)
    .then(function(response) {
      $scope.$broadcast(APP_EVENTS.userUpdates, response.users);
    }, function (error) {
      console.log("MainC.SetUp: getUsers FAILED: " + JSON.stringify(error));
    });
  };

  this.getComponents = function () {
    ModelService.get(MODEL_PATHS.componentPath, self.currentUser.authToken)
    .then(function(response) {
      self.components = response.components;
      $scope.$broadcast(APP_EVENTS.componentUpdates, response.components);
    }, function (error) {
      console.log("MainC.SetUp: getComponents FAILED: " + JSON.stringify(error));
    });
  };

  this.getCustomers = function () {
    ModelService.get(MODEL_PATHS.customerPath, self.currentUser.authToken)
    .then(function(response) {
      self.customers = response.customers;
      $scope.$broadcast(APP_EVENTS.customerUpdates, response.customers);
    }, function (error) {
      console.log("MainC.SetUp: getCustomers FAILED: " + JSON.stringify(error));
    });
  };

  this.setUp = function (userRole) {
    self.getRequests();
    if(userRole === USER_ROLES.admin) {
      self.getUsers();
      self.getComponents();
      self.getCustomers();
    }
  };

  this.init = function() {
    self.currentUser = AuthService.checkSession();
    self.isAuthenticated = AuthService.isAuthenticated();
    if(self.currentUser !== undefined) {
      $timeout(function(){
        self.setUp(self.currentUser.role);
      },1000);
    }
  };

  /* LISTENERS */
  $scope.$on(AUTH_PROPERTIES.loginSuccess, function (event, session) {
    console.log('MainController.$on(AUTH_PROPERTIES.loginSuccess): ' + JSON.stringify(session));
    self.isAuthenticated = AuthService.isAuthenticated();
    self.setCurrentUser(session);
    $timeout(function(){
      self.setUp(self.currentUser.role);
    },1000);
    var lastDigestRun = new Date();
    $rootScope.$watch(function detectIdle() {
      var now = new Date();
      if (now - lastDigestRun > 300000 && AuthService.isAuthenticated()) {
        console.log("BROADCASTING-TIMEOUT...");
        $rootScope.$broadcast(AUTH_PROPERTIES.sessionTimeout);
      }
      lastDigestRun = now;
    });
  });
  $scope.$on(AUTH_PROPERTIES.loginFailed, function () {
    console.log('MainController.$on(AUTH_PROPERTIES.loginFailed)');
  });
  $scope.$on(AUTH_PROPERTIES.currentUserChanged, function (event, newDetails) {
    self.currentUser = AuthService.updateSession(newDetails);
  });
  $scope.$on(AUTH_PROPERTIES.logoutSuccess, function () {
    console.log('MainController' + AuthService.isAuthenticated());
    self.currentUser = undefined;
    self.isAuthenticated = AuthService.isAuthenticated();
    console.log('MainController: LOGGED OUT - self.isAuthenticated = ' + AuthService.isAuthenticated());
  });
});
