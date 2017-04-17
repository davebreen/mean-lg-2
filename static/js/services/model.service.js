'use strict';

angular.module('modelService', [])
.service('ModelService', [ '$http', '$q', function ($http, $q) {
  var db_models = undefined;
  this.get = function (url, sessionToken) {
    var deferred = $q.defer();
    $http.defaults.headers.common.Authorization = sessionToken;
    $http.get(url)
    .then(function(result) {
      db_models = result.data;
      deferred.resolve(db_models);
    }, function(error) {
      db_models = error;
      deferred.reject(db_models);
    });
    db_models = deferred.promise;
    $http.defaults.headers.common.Authorization = '';
    return $q.when(db_models);
  };
  this.create = function(url, modelObject, sessionToken) {
    var deferred = $q.defer();
    $http.defaults.headers.common.Authorization = sessionToken;
    console.log("ModelService-------------POSTING : " + JSON.stringify(modelObject));
    $http.post(url, modelObject)
    .then(function(result) {
      $http.defaults.headers.common.Authorization = sessionToken;
      $http.get(url)
      .then(function(result) {
        db_models = result.data;
        deferred.resolve(db_models);
      }, function(error) {
        db_models = error;
        deferred.reject(db_models);
      });
    }, function(error) {
      db_models = error;
      deferred.reject(error);
    });
    db_models = deferred.promise;
    $http.defaults.headers.common.Authorization = '';
    return $q.when(db_models);
  };
  this.delete = function (url, model_id, sessionToken) {
    var deferred = $q.defer();
    $http.defaults.headers.common.Authorization = sessionToken;
    $http.delete(url + "/" + model_id)
    .then(function(result) {
      deferred.resolve(result.status);
    }, function(error) {
      deferred.reject(error);
    });
    var stat = deferred.promise;
    $http.defaults.headers.common.Authorization = '';
    return $q.when(stat);
  };
  this.update = function (url, model_id, model, sessionToken) {
    var deferred = $q.defer();
    $http.defaults.headers.common.Authorization = sessionToken;
    $http.put(url+ "/" + model_id, model)
    .then(function(result) {
      deferred.resolve(result.status);
    }, function(error) {
      deferred.reject(error);
    });
    var stat = deferred.promise;
    $http.defaults.headers.common.Authorization = '';
    return $q.when(stat);
  };
  this.approve = function(url, sessionToken, license_id, append) {
    var deferred = $q.defer();
    $http.defaults.headers.common.Authorization = sessionToken;
    $http.post(url +"/" + license_id + append)
    .then(function(result) {
      $http.defaults.headers.common.Authorization = sessionToken;
      $http.get(url +"/" + license_id)
      .then(function(result) {
        db_models = result.data;
        deferred.resolve(db_models);
      }, function(error) {
        db_models = error;
        deferred.reject(db_models);
      });
    }, function(error) {
      db_models = error;
      deferred.reject(error);
    });
    db_models = deferred.promise;
    $http.defaults.headers.common.Authorization = '';
    return $q.when(db_models);
  };
  this.comment = function(url, sessionToken, license_id, append, commentObject) {
    var deferred = $q.defer();
    $http.defaults.headers.common.Authorization = sessionToken;
    $http.post(url +"/" + license_id + append, commentObject)
    .then(function(result) {
      $http.defaults.headers.common.Authorization = sessionToken;
      $http.get(url +"/" + license_id + append)
      .then(function(result) {
        db_models = result.data;
        deferred.resolve(db_models);
      }, function(error) {
        db_models = error;
        deferred.reject(db_models);
      });
    }, function(error) {
      db_models = error;
      deferred.reject(error);
    });
    db_models = deferred.promise;
    $http.defaults.headers.common.Authorization = '';
    return $q.when(db_models);
  };
  this.download = function(url, sessionToken, license_id, append) {
    var deferred = $q.defer();
    $http.defaults.headers.common.Authorization = sessionToken;
    $http.get(url +"/" + license_id + append)
    .then(function(result) {
      db_models = result;
      deferred.resolve(result);
    }, function(error) {
      db_models = error;
      deferred.reject(error);
    });
    db_models = deferred.promise;
    $http.defaults.headers.common.Authorization = '';
    return $q.when(db_models);
  }
}]);
