var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var httpHelpers = require('./http-helpers');
var actions = require('./http-helpers').actions;
var collectData = require('./http-helpers').collectData;

var addUrlToList = archive.addUrlToList;


exports.handleRequest = function (req, res) {
  var action = actions[req.method];
  if (action) {
    action(req, res);
  } else {
    send404(res);
  }
};
