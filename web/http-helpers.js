var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};


var collectData = function(request, callback) {
  var data = '';
  request.on('data', function(chunk) {
    data += chunk;
  });
  request.on('end', function() {
    data = data.split('=')[1];
    console.log('LINE 22 -data is ', data);
    callback(data);
  });
};

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change oen.)

exports.serveAssets = function(res, asset, callback) {
  var encoding = 'utf8';

  fs.readFile(archive.paths.siteAssets + asset, encoding, (err, data) => {
    // file not found in /web/public
    if (err) {
      fs.readFile(archive.paths.archivedSites + '/' + asset, encoding, (err, data) => {
        // not found in /archives/sites
        if (err) {
          exports.send404(res);
        } else {
          exports.sendResponse(res, data);
        }
      });
    } else {
      exports.sendResponse(res, data);
    }
  });
};

exports.sendResponse = function(res, data, statusCode) {
  statusCode = statusCode || 200;
  res.writeHead(statusCode, headers);
  res.end(data);
};

exports.send404 = function(res) {
  exports.sendResponse(res, '404 Page Not Found', 404);
};

exports.sendRedirect = function(res, location, status) {
  status = status || 302;
  res.writeHead(status, location);
  res.end();
};



var getHeaders = function(ext) {
  if (ext === '.js') {
    return 'text/javascript';
  }
  if (ext === '.css') {
    return 'text/css';
  }
  if (ext === '.json') {
    return 'application/json';
  }
  if (ext === '.png') {
    return 'image/png';
  }
  if (ext === '.jpg') {
    return 'image/jpg';
  }
  if (ext === '.wav') {
    return 'audio/wav';
  }
  return 'text/html';
};

exports.actions = {
  'GET': function(req, res) {
    var ext = path.extname(req.url);
    console.log('109 -- req.url', req.url);

    if (req.url === '/') {
      var url = '/index.html';
    } else {
      var url = req.url;
    }
    exports.serveAssets(res, url, function (data) {


    // res.end(data);
    });
  },
  'POST': function(req, res) {
    console.log('hit POST section');
    collectData(req, function(url) {
      console.log('line 125 URL', url);

      archive.isUrlArchived(url, function(isFound) {
        if (isFound) {
          exports.serveAssets(res, url);
        } else {
          archive.isUrlInList(url, function(isFound) {
            if (!isFound) {
              archive.addUrlToList(url, function(res) {
                console.log('TESTING');
                // exports.sendResponse(res, data, 302);
                exports.sendRedirect(res, '/loading.html');
              });
            }
            exports.sendRedirect(res, '/loading.html');
          });
        }
      });

      // archive.addUrlToList(url, function() {
      //   // console.log('data # 2', url);
      // res.writeHead(302, headers); //CHANGED TO 302
      // res.end();
    // });
    });
  } ///CLOSE POST FUNCTION
};

// 1 - list of sites
// 2 - sites

// POST request with www.site.com
// collectData  /// www.google.com

// isUrlInList - in sites.txt
//   if yes
//     if archived - > redirect to it
//       sendRedirect (res, '/google')
//     else -> loading.html
//   else
//     add to sites.txt -> addUrlToList(, function () {
//       -> loading
//     })



//   'POST': function(req, res) {
//     utils.collectData(req, function(message) {
//       message.objectId = ++objectIdCounter;
//       messages.push(message);
//       utils.sendResponse(res, {objectId: message.objectId}, 201);
//     });
//   },
//   'OPTIONS': function(req, res) {
//     utils.sendResponse(response, null);
//   }
// };

// exports.requestHandler = utils.makeActionHandler(actions);

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




// As you progress, keep thinking about what helper functions you can put here!

// exports.sendResponse = function(response, data, statusCode) {
//   statusCode = statusCode || 200;
//   response.writeHead(statusCode, headers);
//   response.end(JSON.stringify(data));
// };
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


//TO DO
// Change serveAssets to local var if not needed elsewhere
