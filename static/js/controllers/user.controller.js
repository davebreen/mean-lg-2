'use strict';
angular.module('userController', [])
.controller('UserController', function UserController ($scope, $rootScope, $http, APP_EVENTS, AUTH_PROPERTIES, APP_PROPERTIES, MODEL_PATHS, ModelService, AuthService) {
  this.users = [];
  this.addNewUser = false;
  this.modifyUser = false;
  /* Selected user's current Permissions */
  this.currentPermissions = [];
  /* A placeholder to add or modify a user */
  this.defineUser = {};
  this.permissionList = APP_PROPERTIES.permissionList;
  this.roleList = APP_PROPERTIES.roleList;
  var self = this;
  console.log("User Controller Loaded");

  /* USER Functions */
  this.validateUser = function() {
    if(self.addNewUser) {
      if(self.defineUser.password !== self.passwordMatch)
      {
        self.mismatch = true;
        return false;
      }
    }
    else if(self.updateUser) {
      if(self.changePassword)
      {
        if(self.defineUser.password !== self.passwordMatch)
        {
          self.mismatch = true;
          return false;
        }
      }
    }
    if(self.currentPermissions === undefined || self.currentPermissions.length < 1)
    {
      var ok = confirm("This User has no permissions");
      console.log("OK - " + ok);
      if(ok) {
        return true;
      }
      else {
        return false;
      }
    }
    self.mismatch = false;
    return true;
  }

  this.newUser = function () {
    if(self.defineUser.permissions !== undefined) {
      var permissions = [];
      for (let permission of self.defineUser.permissions) {
        permissions.push({value :permission});
      }
      self.defineUser.permissions = permissions;
    }
    ModelService.create(MODEL_PATHS.userPath, self.defineUser, self.currentUser.authToken)
    .then(function(response) {
      self.clearUser();
      self.users = response.users;
    }, function (error) {
      console.log("UC.newUser: ERROR = " + JSON.stringify(error));
    });
  };

  this.viewUser = function (user) {
    if(user.permissions !== undefined) {
      for (let permission of user.permissions) {
        self.currentPermissions.push(permission.value);
      }
    }
    self.defineUser = user;
    console.log("UC.viewUser: UC.defineUser.permissions = " + JSON.stringify(self.defineUser.permissions));
  };

  this.updateUser = function (user) {
    self.defineUser.permissions = [];
    for (let permission of self.currentPermissions) {
      self.defineUser.permissions.push({value :permission});
    }
    self.currentPermissions = [];
    ModelService.update(MODEL_PATHS.userPath, self.defineUser.uid, self.defineUser, self.currentUser.authToken)
    .then(function(response) {
      if(self.defineUser.uid === self.currentUser.uid)
      {
        self.defineUser.authToken = self.currentUser.authToken;
        $rootScope.$broadcast(AUTH_PROPERTIES.currentUserChanged, self.defineUser);
      }
      self.clearUser();
    }, function (error) {
      console.log("UC.updateUser: ERROR = " + JSON.stringify(error));
    });
  };

  this.updatePermissions = function (permission, includePermission) {
    if(includePermission && self.currentPermissions.indexOf(permission) < 0)
    {
      self.currentPermissions.push(permission);
    }
    else if(!includePermission && self.currentPermissions.indexOf(permission) > -1)
    {
      self.currentPermissions.splice(self.currentPermissions.indexOf(permission), 1);
    }
  };

  this.clearUser = function () {
    self.defineUser = {};
    self.addNewUser = false;
    self.modifyUser = false;
    self.passwordMatch = '';
    self.mismatch = false;
    self.currentPermissions = [];
    self.changePassword = false;
  };

  $scope.$on(APP_EVENTS.setUpComplete, function () {
    console.log("UC - SetUp Complete");
  });
  $scope.$on(APP_EVENTS.userUpdates, function (event, users) {
    self.users = users;
    console.log("UC - Users Loaded");
  });
});
