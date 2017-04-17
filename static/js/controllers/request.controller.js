'use strict';
angular.module('requestController', [])
.controller('RequestController', function RequestController ($scope, $rootScope, $http, APP_EVENTS, MODEL_PATHS, ModelService, UtilityService) {
  this.requests = [];
  this.makeNewRequest = false;
  /* A placeholder to add or modify a request */
  this.defineRequest = {};
  this.updateRequest = {
    customer: false,
    numberOfUsers: false,
    numberOfBatchUsers: false,
    billable: false,
    development: false,
    expiration: false,
    components: false
  };
  /* The components attached to a request before update */
  this.currentComponents = [];
  var self = this;
  console.log("Request Controller Loaded");

  this.newRequest = function () {
    var today = Date.now();
    if (self.defineRequest.expiration.match(/^(\d{2})\/(\d{2})\/(\d{4})$/))
    {
      self.milliseconds = UtilityService.formatDate(self.defineRequest.expiration);
    }
    else
    {
      self.badDateFormat = true;
    }
    if(self.milliseconds > (today + 604800000)) // 1 week
    {
      self.defineRequest.components = [];
      console.log("self.defineRequest.components = []: " + JSON.stringify(self.defineRequest.components));
      console.log("self.selectedComponents: " + JSON.stringify(self.currentComponents));
      var wsComp = {};
      for(let component of self.allComponents)
      {
        console.log("self.allComponents: " + JSON.stringify(component));
        if(component.requestName === 'Web Services Composer')
        {
          console.log("self.allComponents: WS_Comp");
          wsComp = component;
          if(self.currentComponents.indexOf(wsComp.uid) > -1)
          {
            wsComp = {'component': component, 'units': self.wsUnits};
            self.defineRequest.components.push(wsComp);
            console.log("self.allComponents: Pushed " + JSON.stringify(wsComp));
          }
        }
        else if(self.currentComponents.indexOf(component.uid) > -1)
        {
          var comp = {'component': component};
          self.defineRequest.components.push(comp);
          console.log("self.allComponents: Pushed " + comp);
        }
      }
      console.log("self.defineRequest.components: " + JSON.stringify(self.defineRequest.components));
      self.defineRequest.billable = self.isBillable || false;
      self.defineRequest.development = self.isDevelopment || false;
      self.defineRequest.expiration = self.milliseconds;
      self.defineRequest.customer = self.defineRequest.customer.code;
      console.log("self.defineRequest: " + JSON.stringify(self.defineRequest));
      angular.element('#licenseRequestModal').modal('hide');
      console.log("Sending REQUEST: "+MODEL_PATHS.licensePath + "/" + JSON.stringify(self.defineRequest));
      console.log("WITH OBJECT : " + JSON.stringify(self.defineRequest));
      ModelService.create(MODEL_PATHS.licensePath, self.defineRequest, self.currentUser.authToken)
      .then(function(response) {
        self.clearRequest();
        self.clearAll();
        self.requests = response.licenseRequestModels;
      }, function (error) {
        console.log("AC.newRequest: ERROR = " + JSON.stringify(error));
      });
    }
    else {
      self.badDateExpiry = true;
    }
  };

  this.selectRequest = function (request) {
    self.defineRequest = request;
    console.log("AC.selectRequest.request: " + JSON.stringify(request));
    console.log("AC.selectRequest.request.expiration: " + JSON.stringify(request.expiration));
    console.log("AC.selectRequest.defineRequest: " + JSON.stringify(self.defineRequest));
    console.log("AC.selectRequest.defineRequest.expiration: " + JSON.stringify(self.defineRequest.expiration));
    for (let component of self.defineRequest.components) {
      self.currentComponents.push(component.component.uid);
      if(component.units !== undefined) {
        self.wsUnits = component.units;
      }
    }
    self.defineRequest.expirationToDate = UtilityService.millisecondsToDate(self.defineRequest.expiration);
   };

  this.editRequest = function() {
    console.log("AC.editRequest: self.defineRequest.customer: " + JSON.stringify(self.defineRequest.customer));
    console.log("AC.editRequest: self.defineRequest.expiration: " + JSON.stringify(self.defineRequest.expiration));
    var today = Date.now();
    if (self.defineRequest.expirationToDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/))
    {
      self.defineRequest.expiration = UtilityService.formatDate(self.defineRequest.expirationToDate);
    }
    else
    {
      self.badDateFormat = true;
    }
    if(self.defineRequest.expiration > (today + 604800000)) // 1 week
    {
      console.log("AC.editRequest: self.selectedComponents " + JSON.stringify(self.selectedComponents));
      console.log("AC.editRequest: self.currentComponents " + JSON.stringify(self.currentComponents));
      for(let component of self.allComponents)
      {
        if(self.currentComponents.indexOf(component.uid) > -1) {
          console.log("!self.currentComponents.indexOf("+ component.uid + ")");
          if(component.requestName === 'Web Services Composer')
          {
            self.defineRequest.components.push({'component': component, 'units': self.wsUnits});
          }
          else
          {
            console.log("PUSHING ("+ component.uid + ")");
            self.defineRequest.components.push({'component': component});
          }
        }
        else {
          console.log("self.currentComponents.indexOf("+ component.uid + ") is already in list");
        }
        console.log("AC.editRequest: self.currentComponents " + JSON.stringify(self.defineRequest.components));
      }
      console.log("AC.editRequest: self.defineRequest.components " + JSON.stringify(self.defineRequest.components));
      angular.element('#viewLicenseModal').modal('hide');
      console.log("AC.editRequest: UPDATING A REQUEST: " + JSON.stringify(self.defineRequest));
      ModelService.update(MODEL_PATHS.licensePath, self.defineRequest.uid, self.defineRequest, self.currentUser.authToken)
      .then(function(response) {
        ModelService.get(MODEL_PATHS.licensePath, self.currentUser.authToken)
        .then(function(response) {
          console.log("AC.editRequest.getRequests: RESPONSE = " + JSON.stringify(response));
          self.requests = response.licenseRequestModels;
          self.clearRequest();
          self.clearAll();
        }, function (error) {
          console.log("AC.editRequest.getRequests: ERROR = " + JSON.stringify(error));
        });
        console.log("AC.editRequest: UPDATE SUCCESS: " + JSON.stringify(response));
      }, function (error) {
        console.log("AC.newRequest: ERROR = " + JSON.stringify(error));
      });
    }
    else {
      self.badDateExpiry = true;
    }
  };

  this.getApproval = function (uid) {
    ModelService.approve(MODEL_PATHS.licensePath, self.currentUser.authToken, uid, MODEL_PATHS.approvalAppendix)
    .then(function(response) {
      ModelService.get(MODEL_PATHS.licensePath, self.currentUser.authToken)
      .then(function(response) {
        console.log("AC.getApproval.getRequests: RESPONSE = " + JSON.stringify(response));
        self.requests = response.licenseRequestModels;
        self.clearRequest();
        self.clearAll();
      }, function (error) {
        console.log("AC.getApproval.getRequests: ERROR = " + JSON.stringify(error));
      });
    }, function (error) {
      console.log("AC.getApproval: ERROR = " + JSON.stringify(error));
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

  this.submitComment = function (requestUID) {
    var commentObject = {"message": this.newComment};
    console.log("AC.submitComment(): Message" + JSON.stringify(commentObject.message) + "; RequestUID: " + JSON.stringify(requestUID));
    ModelService.comment(MODEL_PATHS.licensePath, self.currentUser.authToken, requestUID, MODEL_PATHS.commentAppendix, commentObject)
    .then(function(response) {
      console.log("AC.submitComment() response: " + JSON.stringify(response));
      self.requestComments = response.comments;
      self.newComment = '';
    }, function (error) {
      console.log("AC.submitComment(): ERROR" + JSON.stringify(error));
    });
  };

  this.manageComponents = function (component, includeComponent) {
    console.log("AC.manageComponents(" + JSON.stringify(component) + ", " + includeComponent +")");
    if(includeComponent && self.currentComponents.indexOf(component.uid) < 0)
    {
      self.currentComponents.push(component.uid);
    }
    else if(!includeComponent && self.currentComponents.indexOf(component.uid) > -1)
    {
      self.currentComponents.splice(self.currentComponents.indexOf(component.uid), 1);
      if(component.requestName === "Web Services Composer") {
        self.wsUnits = '';
      }
    }
  };

  this.convertMS = function (ms) {
    return UtilityService.millisecondsToDate(ms);
  };

  $scope.$on(APP_EVENTS.requestUpdates, function (event, requests) {
    self.requests = requests;
    console.log("RC - Requests Loaded");
  });
});
