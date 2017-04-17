var mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;

var UserSchema = new mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String,
  password: String,
  email: String,
  role: String,
  permissions: [{value: String}]
});

UserSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    var retJson = {
      uid: ret._id,
      username: ret.username,
      firstName: ret.firstName,
      lastName: ret.lastName,
      email: ret.email,
      role: ret.role,
      permissions: ret.permissions
    }
    return retJson;
  }
});

UserSchema.virtual('uid').
  get(function() { return this._id; });

var CommentSchema = new mongoose.Schema({
  message : String,
  timestamp : Number,
  license: mongoose.Schema.Types.ObjectId,
  user: mongoose.Schema.Types.ObjectId
});

CommentSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    var retJson = {
      uid: ret._id,
      message: ret.message,
      timestamp: ret.timestamp,
      license: ret.license,
      user: ret.user
    }
    return retJson;
  }
});

CommentSchema.virtual('uid').
  get(function() { return this._id; });

var LicenseSchema = new mongoose.Schema({
  customer: String,
  numberOfUsers: Number,
  numberOfBatchUsers: Number,
  billable: Boolean,
  development: Boolean,
  reason: String,
  customerContact: String,
  expiration: Number,
  components: [{
    component: {uid: mongoose.Schema.Types.ObjectId},
    expiration: Number,
    units: Number
  }],
  licenseKey: String,
  user: mongoose.Schema.Types.ObjectId
});

LicenseSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    var retJson = {
      uid: ret._id,
      customer: ret.customer,
      numberOfUsers: ret.numberOfUsers,
      numberOfBatchUsers: ret.numberOfBatchUsers,
      billable: ret.billable,
      development: ret.development,
      reason: ret.reason,
      customerContact: ret.customerContact,
      expiration: ret.expiration,
      components: ret.components,
      licenseKey: ret.licenseKey,
      user: ret.user
    }
    return retJson;
  }
});

LicenseSchema.virtual('uid').
  get(function() { return this._id; });

var ComponentSchema = new mongoose.Schema({
  requestName : String,
  licenseName : String,
  units : Number
});

ComponentSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    var retJson = {
      uid: ret._id,
      requestName: ret.requestName,
      licenseName: ret.licenseName,
      units: ret.units
    }
    return retJson;
  }
});

ComponentSchema.virtual('uid').
  get(function() { return this._id; });

var CustomerSchema = new mongoose.Schema({
  code : String,
  name : String
});

CustomerSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    var retJson = {
      uid: ret._id,
      code: ret.code,
      name: ret.name
    }
    return retJson;
  }
});

CustomerSchema.virtual('uid').
  get(function() { return this._id; });

var User = mongoose.model('User', UserSchema, 'users');
var Comment = mongoose.model('Comment', CommentSchema, 'comments');
var License = mongoose.model('License', LicenseSchema, 'licenses');
var Component = mongoose.model('Component', ComponentSchema, 'components');
var Customer = mongoose.model('Customer', CustomerSchema, 'customers');

module.exports = {
  User: User,
  Comment: Comment,
  License: License,
  Component: Component,
  Customer: Customer
};
