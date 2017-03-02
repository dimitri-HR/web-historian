var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var httpHelpers = require('./http-helpers');
var actions = require('./http-helpers').actions;
var collectData = require('./http-helpers').collectData;

var addUrlToList = archive.addUrlToList;




// var router = {
//   '/classes/messages': messages.requestHandler
//   // ...
// };
//
// var server = http.createServer( function(req, res) {
//   console.log('Serving request type ' + req.method + ' for url ' + req.url);
//
//   var route = router[url.parse(req.url).pathname];
//   if (route) {
//
//     route(req, res);
//
//
//   } else {
//     utils.sendResponse(res, '', 404);
//   }
// });


var router = {
  '/styles.css': true
  // ...
};

exports.handleRequest = function (req, res) {
  var statusCode = 200;

  var headers = httpHelpers.headers;

  if ((req.method === 'GET') && (router[req.url] || req.url === '/')) {
    actions[req.method](req, res, headers, statusCode);
  // } else if (req.method === 'GET' && req.url) {
  //   actions[req.method](req, res, headers, statusCode);

  } else if (req.method === 'POST') {
    console.log('hit post section');
    collectData(req, function(url) {
      console.log('data', url);
      addUrlToList(url, function() {
        // console.log('data # 2', url);
        res.writeHead(302, headers); //CHANGED TO 302
        res.end();
      });
    });

  } else {
      res.writeHead(404, headers);
    res.end('PAGE NOT FOUND');
  }
};


// var actions = {
//   'GET': function(request, response) {
//     utils.sendResponse(response, {results: messages});
//   },
//   'POST': function(request, response) {
//     utils.collectData(request, function(message) {
//       message.objectId = ++objectIdCounter;
//       messages.push(message);
//       utils.sendResponse(response, {objectId: message.objectId}, 201);
//     });
//   },
//   'OPTIONS': function(request, response) {
//     utils.sendResponse(response, null);
//   }
// };
//
// exports.requestHandler = utils.makeActionHandler(actions);
//
// exports.makeActionHandler = function(actionMap) {
//   return function(request, response) {
//     var action = actionMap[request.method];
//     if (action) {
//       action(request, response);
//     } else {
//       exports.sendResponse(response, '', 404);
//     }
//   };
// };
