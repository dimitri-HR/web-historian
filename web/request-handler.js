var path = require('path');
var helpers = require('./http-helpers');

exports.handleRequest = function (req, res) {
  var action = helpers.actions[req.method];
  if (action) {
    action(req, res);
  } else {
    helpers.send404(res);
  }
};
