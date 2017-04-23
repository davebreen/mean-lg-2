var Models = require('../db/models');
module.exports = function(app) {
  var index = require('./controllers');

  app.post('/api/auth', function(req, res) {
    var query  = Models.User.findOne({ username: req.body.username });
    var promise = query.exec();
    promise.then(function (user) {
      if(user !== null) {
        res.json({
          user: user,
          authToken: user.uid
         });
      }
      else {
        res.json({ error: "Authentication failed ..." });
      }
    }).catch(function(err){
      console.log("error: " + err);
    });
  });

  app.get('/api/users', function(req, res) {
    var query  = Models.User.find();
    var promise = query.exec();
    promise.then(function (users) {
      if(users !== null) {
        res.json({ users: users });
      }
      else {
        res.json({ error: "No users found ..." })
      }
    }).catch(function(err){
      res.json({ error: "No users found ..."});
    });
  });

  app.get('/api/users/:user_id', function(req, res) {
    var query  = Models.User.findOne({ _id: req.params.user_id })
    var promise = query.exec();
    promise.then(function (user) {
      if(user !== null) {
        res.json(user);
      }
      else {
        res.json({ error: "User not found ..." });
      }
    }).catch(function(err){
      console.log("error: " + err);
    });
  });

  app.put('/api/users/:user_id', function(req, res) {
    console.log("app.put(user_id) "+req.params.user_id + ": " + JSON.stringify(req.body));
    var query  = Models.User.findOneAndUpdate({ _id: req.params.user_id }, req.body);
    var promise = query.exec();
    promise.then(function (user) {
      if(user !== null) {
        res.json(user);
      }
      else {
        res.json({ error: "User Update: user 'null' ..." });
      }
    }).catch(function(err){
      console.log("error: " + err);
    });
  });

  app.post('/api/users', function(req, res) {
    var user = new Models.User({
      username: req.body.username,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      role: req.body.role,
      permissions: req.body.permissions
    });
    var promise = user.save();
    promise.then(function (users) {
      if(users !== null) {
        res.json(users);
      }
      else {
        res.json({ error: "New user failed ..." })
      }
    }).catch(function(err){
      res.json({ error: "New user ERROR ..." });
    });
  });

  app.delete('/api/users/:user_id', function(req, res) {
    var query  = Models.User.findByIdAndRemove(req.params.user_id);
    var promise = query.exec();
    promise.then(function (users) {
      if(users !== null) {
        res.json(users);
      }
      else {
        res.json({ error: "Remove user failed ..." })
      }
    }).catch(function(err){
      res.json({ error: "Remove user failed ... "});
    });
  });

  app.get('/api/licenses', function(req, res) {
    var query  = Models.License.find();
    var promise = query.exec();
    promise.then(function (licenses) {
      if(licenses !== null) {
        res.json({ licenseRequestModels: licenses });
      }
      else {
        res.json({ error: "No licenses found ..." });
      }
    }).catch(function(err){
      res.json({ error: "No customers found ..."});
    });
  });

  app.get('/api/licenses/:license_id', function(req, res) {
    var query = Models.License.findOne({ _id: req.params.license_id });
    var promise = query.exec();
    promise.then(function (license) {
      if(license !== null) {
        res.json(license);
      }
      else {
        res.json({ error: "License ID " + req.params.license_id + " not found ..." });
      }
    }).catch(function(err){
      res.json({ error: "Error retrieving License ID " + req.params.license_id });
    });
  });

  app.get('/api/licenses/:license_id/download', function(req, res) {
    var query = Models.License.findOne({ _id: req.params.license_id });
    var promise = query.exec();
    promise.then(function (license) {
      if(license !== null) {
        res.send("<?xml version='1.0' encoding='UTF-8'?><signature>" + license.licenseKey + "</signature>");
      }
      else {
        res.json({ error: "License ID " + req.params.license_id + " not available for download ..." });
      }
    }).catch(function(err){
      res.json({ error: "Error retrieving License ID " + req.params.license_id });
    });
  });

  app.post('/api/licenses', function(req, res) {
    var license = new Models.License({
      customer: req.body.customer,
      numberOfUsers: req.body.numberOfUsers,
      numberOfBatchUsers: req.body.numberOfBatchUsers,
      expiration: req.body.expiration,
      components: req.body.components,
      licenseKey: null,
      billable: req.body.billable,
      development: req.body.development,
      reason: req.body.reason,
      customerContact: req.body.customerContact
    });
    var promise = license.save();
    promise.then(function (license) {
      if(license !== null) {
        res.json(license);
      }
      else {
        res.json({ error: "License ID " + req.params.license_id + " not found ..." });
      }
    }).catch(function(err){
      res.json({ error: "Error Creating License" + req.params.license_id });
    });
  });

  app.put('/api/licenses/:license_id', function(req, res) {
    var query = Models.License.findOneAndUpdate({_id: req.params.license_id}, req.body);
    var promise = query.exec();
    promise.then(function (license) {
      if(license !== null) {
        res.json(license);
      }
      else {
        res.json({ error: "License ID " + req.params.license_id + " not found ..." });
      }
    }).catch(function(err){
      res.json({ error: "Error Updating License" + req.params.license_id });
    });
  });

  app.post('/api/licenses/:license_id/approve', function(req, res) {
    var query = Models.License.findOneAndUpdate({ _id : req.params.license_id }, { licenseKey: "APPROVED"}, {upsert:true});
    var promise = query.exec();
    promise.then(function (license) {
      if(license !== null) {
        res.json(license);
      }
      else {
        res.json({ error: "License ID " + req.params.license_id + " not found ..." });
      }
    }).catch(function(err){
      res.json({ error: "Error Updating License" + req.params.license_id });
    });
  });

  app.get('/api/licenses/:license_id/comments', function(req, res) {
    var query = Models.Comment.find({ license: req.params.license_id });
    var promise = query.exec();
    promise.then(function (comments) {
      if(comments !== null) {
        console.log("GET - /api/licenses/:" + req.params.license_id + "/comments: " + comments);
        res.json({ comments: comments });
      }
      else {
        res.json({ error: "Comments for License ID " + req.params.license_id + " not found ..." });
      }
    }).catch(function(err){
      res.json({ error: "Error retrieving Comments for License " + req.params.license_id });
    });
  });

  app.post('/api/licenses/:license_id/comments', function(req, res) {
    var comment = new Models.Comment({
      message : req.body.message,
      timestamp: Date.now(),
      license : req.params.license_id,
      user : req.body.user_id
    });
    var promise = comment.save();
    console.log("POST - /api/licenses/:" + req.params.license_id + "/comments: " + comment);
    promise.then(function (comments) {
      if(comments !== null) {
        res.json({ comments: comments });
      }
      else {
        res.json({ error: "Error posting Comment for License ID " + req.params.license_id});
      }
    }).catch(function(err){
      res.json({ error: "Error posting Comment for License " + req.params.license_id });
    });
  });

  app.get('/api/components', function(req, res) {
    var query  = Models.Component.find();
    var promise = query.exec();
    promise.then(function (components) {
      if(components !== null) {
        res.json({ components: components });
      }
      else {
        res.json({ error: "No components found ..." })
      }
    }).catch(function(err){
      res.json({ error: "No components found ..." });
    });
  });

  app.get('/api/customers', function(req, res) {
    var query  = Models.Customer.find();
    var promise = query.exec();
    promise.then(function (customers) {
      if(customers !== null) {
        res.json({ customers: customers });
      }
      else {
        res.json({ error: "No customers found ..." });
      }
    }).catch(function(err){
      res.json({ error: "No customers found ..."});
    });
  });

  app.get('/', index.mainIndex);

};
