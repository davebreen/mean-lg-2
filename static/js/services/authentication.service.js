'use strict';

angular.module('authenticationServices', [])
.service('Session', function () {
  this.create = function (sessionId, sessionUsername, sessionToken, sessionRole, sessionPermissions) {
    this.uid = sessionId;
    this.username = sessionUsername;
    this.authToken = sessionToken;
    this.role = sessionRole;
    this.permissions = sessionPermissions;
  };
  this.update = function (updateId, updateUsername, updateToken, updateRole, updatePermissions) {
    this.uid = updateId;
    this.username = updateUsername;
    this.authToken = updateToken;
    this.role = updateRole;
    this.permissions = updatePermissions;
  };
  this.destroy = function () {
    this.uid = null;
    this.username = null;
    this.authToken = null;
    this.role = null;
    this.permissions = null;
  };
  this.getSession = function (){
    return {
      uid: this.uid,
      username: this.username,
      authToken: this.authToken,
      role : this.role,
      permissions : this.permissions
    }
  }
})
.service('SessionStorage', function($window) {
  this.confirmStorage = function(type){
    try {
      var storage = window[type];
      var x = '__storage_test__';
      storage.setItem(x, "Stored");
      storage.removeItem(x);
      return true;
    }
    catch(e) {
      return false;
    }
  }
  this.saveToStorage = function(session){
    window.sessionStorage.setItem('current_session_id', session.uid);;
    window.sessionStorage.setItem('current_session_username', session.username);
    window.sessionStorage.setItem('current_session_token', session.authToken);
    window.sessionStorage.setItem('current_session_role', session.role);
    window.sessionStorage.setItem('current_session_permissions', JSON.stringify(session.permissions));
  }
  this.retrieveFromStorage = function(){
    var user = {
      "uid": window.sessionStorage.getItem('current_session_id'),
      "username": window.sessionStorage.getItem('current_session_username'),
      "authToken": window.sessionStorage.getItem('current_session_token'),
      "role" : window.sessionStorage.getItem('current_session_role'),
      "permissions" : JSON.parse(window.sessionStorage.getItem('current_session_permissions'))
    }
    return user;
  }
  this.size = function() {
    return window.sessionStorage.length;
  }
  this.clearStorage = function() {
    window.sessionStorage.clear();
  }
})
.factory('AuthService', function ($http, Session, SessionStorage, AUTH_PROPERTIES) {
  var ep_models = undefined;
  var authService = {};
  authService.submitAuth = function (credentials) {
    return $http.post(AUTH_PROPERTIES.authEndPoint, credentials);
  };
  authService.checkSession = function () {
    var currentSession = undefined;
    if (SessionStorage.confirmStorage('sessionStorage') && SessionStorage.size() > 0) {
      try {
        currentSession = SessionStorage.retrieveFromStorage();
        Session.create(currentSession.uid, currentSession.username, currentSession.authToken, currentSession.role, currentSession.permissions);
      } catch (err) {
        console.log("SessionStorage.retrieveFromStorage: " + err.message);
      } finally {
        return currentSession;
      }
    }
  };
  authService.storeSession = function (authentication) {
    var permissions = {};
    for(let perm in authentication.user.permissions)
    {
      var val = authentication.user.permissions[perm].value.toLowerCase();
      permissions[val] = true;
    }
    Session.create(authentication.user.uid, authentication.user.username, authentication.authToken, authentication.user.role, permissions);
    SessionStorage.saveToStorage(Session.getSession());
    return Session.getSession();
  };

  authService.updateSession = function (user) {
    var permissions = {};
    for(let perm in user.permissions)
    {
      var val = user.permissions[perm].value.toLowerCase();
      permissions[val] = true;
    }
    Session.update(user.uid, user.username, Session.getSession().authToken, user.role, permissions);
    SessionStorage.clearStorage();
    SessionStorage.saveToStorage(Session.getSession());
    return Session.getSession();
  };

  authService.revokeAuth = function () {
    if (this.isAuthenticated()) {
      SessionStorage.clearStorage();
      Session.destroy();
      return true;
    }
    return false;
  };

  authService.isAuthenticated = function () {
    return Session.uid != null;
  }
  return authService;
});
