'use strict';
angular.module('requestController', [])
.controller('RequestController', function RequestController ($scope, $rootScope, $http, $window, APP_EVENTS, MODEL_PATHS, ModelService, UtilityService) {
  this.requests = [];
  this.makeNewRequest = false;
  this.updateRequest = false;
  /* A placeholder to add or modify a request */
  this.defineRequest = {};
  this.comments = [];
  this.newComment = '';
  this.requestComments = [];
  this.badDateFormat = false;
  this.badDateExpiry = false;
  this.noComponents = false;
  /* The components attached to a request before update */
  this.requestComponents = [];
  var self = this;
  //console.log("Request Controller Loaded");

  this.validateRequest = function() {
    var today = Date.now();
    if (!(self.defineRequest.expiration.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)))
    {
      self.badDateFormat = true;
      return false;
    }
    if(!(UtilityService.formatDate(self.defineRequest.expiration) > (today + 604800000))) {
      self.badDateExpiry = true;
      return false;
    }
    if(!(self.requestComponents.length > 0)) {
      self.noComponents = true;
      return false;
    }
    self.badDateFormat = false;
    self.badDateExpiry = false;
    self.noComponents = false;
    return true;
  }

  this.validateUpdate = function() {
    var today = Date.now();
    if(self.defineRequest.expiration !== self.updateExpiration) {
      if (!(self.updateExpiration.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)))
      {
        self.badDateFormat = true;
        return false;
      }
      if(!(UtilityService.formatDate(self.updateExpiration) > (today + 604800000))) {
        self.badDateExpiry = true;
        return false;
      }
    }
    if(!(self.requestComponents.length > 0)) {
      self.noComponents = true;
      return false;
    }
    self.badDateFormat = false;
    self.badDateExpiry = false;
    self.noComponents = false;
    return true;
  }

  this.clearRequest = function() {
    self.defineRequest = {};
    self.requestComponents = [];
    self.requestComments = [];
    self.wsUnits = '';
  }

  this.newRequest = function () {
    self.defineRequest.expiration = UtilityService.formatDate(self.defineRequest.expiration);
    self.defineRequest.components = [];
    //console.log("self.selectedComponents: " + JSON.stringify(self.requestComponents));
    var wsComp = {};
    for(let component of self.components)
    {
      //console.log("self.allComponents: " + JSON.stringify(component));
      if(component.requestName === 'Web Services Composer')
      {
        //console.log("self.allComponents: WS_Comp");
        wsComp = component;
        if(self.requestComponents.indexOf(wsComp.uid) > -1)
        {
          wsComp = {'component': component, 'units': self.wsUnits};
          self.defineRequest.components.push(wsComp);
          //console.log("self.allComponents: Pushed " + JSON.stringify(wsComp));
        }
      }
      else if(self.requestComponents.indexOf(component.uid) > -1)
      {
        var comp = {'component': component};
        self.defineRequest.components.push(comp);
        //console.log("self.allComponents: Pushed " + comp);
      }
    }
    console.log("self.defineRequest.components: " + JSON.stringify(self.defineRequest.components));
    self.defineRequest.customer = self.defineRequest.customer.code;
    ModelService.create(MODEL_PATHS.licensePath, self.defineRequest, self.currentUser.authToken)
    .then(function(response) {
      self.requests = response.licenseRequestModels;
    }, function (error) {
      //console.log("RC.newRequest: ERROR = " + JSON.stringify(error));
    });
    self.clearRequest();
    self.makeNewRequest = false;
  };

  this.selectRequest = function (request) {
    self.defineRequest = request;
    self.originalBillable = self.defineRequest.billable;
    self.originalDevelopment = self.defineRequest.development;
    self.updateExpiration = self.defineRequest.expiration;
    self.customerCodes = [];
    for(let c of self.customers) {
      self.customerCodes.push(c.code);
    }
    //console.log("RC.selectRequest.request: " + JSON.stringify(request));
    for (let component of self.defineRequest.components) {
      self.requestComponents.push(component.component.uid);
      if(component.units !== undefined) {
        self.wsUnits = component.units;
      }
    }
    ModelService.get(MODEL_PATHS.licensePath + "/" + self.defineRequest.uid + MODEL_PATHS.commentAppendix, self.currentUser.authToken)
      .then(function(response) {
        //console.log("RC.viewRequest.getComments: response: " + JSON.stringify(response));
        self.requestComments = response.comments;
      }, function (error) {
        //console.log("RC.viewRequest.getComments: error: " + JSON.stringify(error));
      });
    //console.log("RC.requestComponents: " + JSON.stringify(self.requestComponents));
   };

  this.editRequest = function() {
    if(self.defineRequest.expiration !== self.updateExpiration) {
      self.defineRequest.expiration = UtilityService.formatDate(self.updateExpiration);
    }
    self.defineRequest.components = [];
    if(self.defineRequest.billable && self.defineRequest.development) {
      self.defineRequest.billable = !self.originalBillable;
      self.defineRequest.development = !self.originalDevelopment;
    }
    for(let c of self.customers) {
      if(c.code === self.defineRequest.customer) {
        self.defineRequest.customer = c;
      }
    }
    //console.log("self.selectedComponents: " + JSON.stringify(self.requestComponents));
    var wsComp = {};
    for(let component of self.components)
    {
      //console.log("self.allComponents: " + JSON.stringify(component));
      if(component.requestName === 'Web Services Composer')
      {
        //console.log("self.allComponents: WS_Comp");
        wsComp = component;
        if(self.requestComponents.indexOf(wsComp.uid) > -1)
        {
          wsComp = {'component': component, 'units': self.wsUnits};
          self.defineRequest.components.push(wsComp);
          //console.log("self.allComponents: Pushed " + JSON.stringify(wsComp));
        }
      }
      else if(self.requestComponents.indexOf(component.uid) > -1)
      {
        var comp = {'component': component};
        self.defineRequest.components.push(comp);
        //console.log("self.allComponents: Pushed " + comp);
      }
    }
    console.log("RC.editRequest: UPDATING REQUEST: " + JSON.stringify(self.defineRequest));
    self.defineRequest.customer = self.defineRequest.customer.code;
    ModelService.update(MODEL_PATHS.licensePath, self.defineRequest.uid, self.defineRequest, self.currentUser.authToken)
    .then(function(response) {
      ModelService.get(MODEL_PATHS.licensePath, self.currentUser.authToken)
        .then(function(response) {
          console.log("RC.editRequest.getRequests: RESPONSE = " + JSON.stringify(response));
          self.requests = response.licenseRequestModels;
          self.clearRequest();
        }, function (error) {
          console.log("RC.editRequest.getRequests: ERROR = " + JSON.stringify(error));
        });
        console.log("RC.editRequest: UPDATE SUCCESS: " + JSON.stringify(response));
    }, function (error) {
      console.log("RC.newRequest: ERROR = " + JSON.stringify(error));
    });
    self.clearRequest();
    self.updateRequest = false;
    self.updateExpiration = '';
  };

  this.getApproval = function (uid) {
    ModelService.approve(MODEL_PATHS.licensePath, self.currentUser.authToken, uid, MODEL_PATHS.approvalAppendix)
    .then(function(response) {
      ModelService.get(MODEL_PATHS.licensePath, self.currentUser.authToken)
      .then(function(response) {
        console.log("RC.getApproval.getRequests: RESPONSE = " + JSON.stringify(response));
        self.requests = response.licenseRequestModels;
      }, function (error) {
        console.log("RC.getApproval.getRequests: ERROR = " + JSON.stringify(error));
      });
    }, function (error) {
      console.log("RC.getApproval: ERROR = " + JSON.stringify(error));
    });
  };

  this.downloadLicense = function (customer, uid) {
    var fileName = customer+"_license.xml";
    var a = document.createElement("a");
    document.body.appendChild(a);
    ModelService.download(MODEL_PATHS.licensePath, self.currentUser.authToken, uid, MODEL_PATHS.downloadAppendix)
    .then(function (result) {
      var file = new Blob([result.data], {type: 'application/xml'});
      var fileURL = window.URL.createObjectURL(file);
      a.href = fileURL;
      a.download = fileName;
      a.click();
    });
  };

  this.addComment = function () {
    var commentObject = {"message": this.newComment};
    self.requestComments.push(commentObject);
  };

  this.submitComment = function (requestUID) {
    var commentObject = {"message": this.newComment};
    console.log("RC.submitComment(): Message" + JSON.stringify(commentObject.message) + "; RequestUID: " + JSON.stringify(requestUID));
    ModelService.comment(MODEL_PATHS.licensePath, self.currentUser.authToken, requestUID, MODEL_PATHS.commentAppendix, commentObject)
    .then(function(response) {
      console.log("RC.submitComment() response: " + JSON.stringify(response));
      self.requestComments = response.comments;
      self.newComment = '';
      self.toggleCollapse();
    }, function (error) {
      console.log("RC.submitComment(): ERROR" + JSON.stringify(error));
    });
  };

  this.manageComponents = function (component, includeComponent) {
    console.log("RC.manageComponents(" + JSON.stringify(component) + ", " + includeComponent +")");
    if(includeComponent && self.requestComponents.indexOf(component.uid) < 0)
    {
      self.requestComponents.push(component.uid);
      if(component.requestName === "Web Services Composer") {
        console.log("WebS selected...");
        $('#webServiceUnits').prop('disabled', false);
        $('#webServiceUnits').focus();
      }
    }
    else if(!includeComponent && self.requestComponents.indexOf(component.uid) > -1)
    {
      self.requestComponents.splice(self.requestComponents.indexOf(component.uid), 1);
      if(component.requestName === "Web Services Composer") {
        $('#webServiceUnits').prop('disabled', true);
        self.wsUnits = '';
      }
    }
  };

  this.toggleCollapse = function (collapse) {
    if(angular.element(collapse).collapse('show')) {
      angular.element(collapse).collapse('hide')
    }
    else {
      angular.element(collapse).collapse('show')
    }
  };

  this.formatDate = function (slashDate) {
    return UtilityService.formatDate(slashDate);
  };

  this.convertMS = function (ms) {
    return UtilityService.millisecondsToDate(ms);
  };

  this.addSlash = function () {
    if(self.updateExpiration !== undefined) {
      self.updateExpiration = UtilityService.addSlash(self.updateExpiration);
    }
    else if(self.defineRequest.expiration !== undefined) {
      self.defineRequest.expiration = UtilityService.addSlash(self.defineRequest.expiration);
    }
  };

  $scope.$on(APP_EVENTS.requestUpdates, function (event, requests) {
    self.requests = requests;
    console.log("RC - Requests Loaded");
  });
});
