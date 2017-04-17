'use strict';

angular.module('utilityService', [])
.service('UtilityService', function  () {

	this.formatDate = function (date) {
		var day = date[0] + date[1];
		var month = date[3] + date[4];
		var year = date[6] + date[7] + date[8] + date[9];
		var ms = Date.UTC(parseInt(year), parseInt(month)-1, parseInt(day));
		return ms;
	};

	this.millisecondsToDate = function (milliseconds) {
		var parsedMS =  new Date(parseInt(milliseconds));
		var displayDate = ('0' + parsedMS.getDate()).slice(-2) + '/' + ('0' + (parsedMS.getMonth()+1)).slice(-2) + "/" + parsedMS.getFullYear();
		return displayDate;
	};

	this.addSlash = function(textEntry) {
		if(textEntry.match(/^(\d{2})$/))
    {
      return textEntry+'/';
    }
    else if(textEntry.match(/^(\d{2})\/(\d{2})$/))
    {
      return textEntry+'/';
    }
		else
		{
			return textEntry;
		}
	};
});
