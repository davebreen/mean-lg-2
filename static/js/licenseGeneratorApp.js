'use strict';
angular.module('licenseGeneratorApp', [
  'loginController',
  'mainController',
  'userController',
  'requestController',
  'customerController',
  'componentController',
  'authenticationServices',
  'modelService',
  'utilityService'
])
.component('signInComponent', {
  templateUrl: "../templates/signin.html",
  controller: 'LoginController',
  controllerAs: 'LC',
  bindings : {
    currentUser : "<"
  }
})
.component('userComponent', {
  templateUrl: "../templates/userView.html",
  controller: 'UserController',
  controllerAs: 'UC',
  bindings : {
    currentUser : "<"
  }
})
.component('requestComponent', {
  templateUrl: "../templates/requestView.html",
  controller: 'RequestController',
  controllerAs: 'RC',
  bindings : {
    currentUser : "<",
    components : "<",
    customers : "<"
  }
})
.component('customerComponent', {
  templateUrl: "../templates/customerView.html",
  controller: 'CustomerController',
  controllerAs: 'CTC',
  bindings : {
    currentUser : "<"
  }
})
.component('componentComponent', {
  templateUrl: "../templates/componentView.html",
  controller: 'ComponentController',
  controllerAs: 'CPC',
  bindings : {
    currentUser : "<",
    users : "<"
  }
})
.constant('APP_PROPERTIES', {
  customerList: [

  ],
  componentList: [

  ],
  permissionList: [
    "APPROVE",
    "REQUEST"
  ],
  roleList: [
    "ADMIN",
    "STANDARD"
  ]
})
.constant('AUTH_PROPERTIES', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  currentUserChanged: 'current-user-changed',
  authEndPoint: '/api/auth',
  sessionTimeout: 'auth-session-timeout'
})
.constant('APP_EVENTS', {
  setUpComplete: 'set-up-complete',
  userUpdates: 'user-updates',
  requestUpdates: 'request-updates',
  componentUpdates: 'component-updates',
  customerUpdates: 'customer-updates',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  createUserSuccess: 'create-user-success',
  createUserFailed: 'create-user-failed',
  sessionTimeout: 'auth-session-timeout'
})
.constant('MODEL_PATHS', {
  userPath: '/api/users',
  licensePath: '/api/licenses',
  customerPath: '/api/customers',
  componentPath: '/api/components',
  approvalAppendix: '/approve',
  commentAppendix: '/comments',
  downloadAppendix: '/download'
})
.constant('USER_ROLES', {
  admin: 'ADMIN',
  standard: 'STANDARD'
})
.directive('switchtab', function () {
  return {
    link: function (scope, element, attrs) {
      element.click(function(e) {
        e.preventDefault();
        $(element).tab('show');
      });
    }
  };
});
