'use strict';
angular.module('loginController', [])
.controller('LoginController', function LoginController ($scope, $rootScope, AUTH_PROPERTIES, APP_EVENTS, AuthService) {
  this.loginFailed = false;
  this.isAuthenticated = AuthService.isAuthenticated();
  var self = this;
  this.submitAuth = function () {
    if (!AuthService.isAuthenticated()) {
      var credentials = {"username": self.username, "password": self.password};
      AuthService.submitAuth(credentials)
      .then(function (result) {
        if (result.data.error) {
          console.log("Auth Service error: " + JSON.stringify(result.data.error));
          self.resetFields();
          self.loginFailed = true;
          $rootScope.$broadcast(AUTH_PROPERTIES.loginFailed);
        }
        else {
          console.log("Auth Service User: " + JSON.stringify(result.data));
          self.resetFields();
          self.loginFailed = false;
          var authorised = AuthService.storeSession(result.data);
          $rootScope.$broadcast(AUTH_PROPERTIES.loginSuccess, authorised);
        }
      }, function (error) {
        self.resetFields();
        self.loginFailed = true;
        $rootScope.$broadcast(AUTH_PROPERTIES.loginFailed);
      });
    }
  };
  this.logout = function () {
      if(AuthService.revokeAuth()) {
        $rootScope.$broadcast(AUTH_PROPERTIES.logoutSuccess);
      }
  };
  this.resetFields = function () {
    self.username = null;
    self.password = null;
  };
  $scope.$on(AUTH_PROPERTIES.logoutSuccess, function () {
    self.resetFields();
    self.isAuthenticated = AuthService.isAuthenticated();
  });
  $scope.$on(AUTH_PROPERTIES.sessionTimeout, function () {
    alert("Your Session has timed out. Please Log-in again");
    self.logout();
  });
  $scope.$on(APP_EVENTS.setUpComplete, function () {
    console.log("LC - SetUp Complete");
  });
});
