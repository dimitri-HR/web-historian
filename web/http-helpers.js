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

exports.headers = headers;

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change oen.)



  fs.readFile(archive.paths.siteAssets + asset, null, (err, data) => {
    // if (true) {}

    if (err) {
      // res.writeHead(404, headers);
      // res.end('No file')
      throw err;
    } else {
    // console.log(data);
    }
    callback(data);
  });


  exports.paths = {
    siteAssets: path.join(__dirname, '../web/public'),
    archivedSites: path.join(__dirname, '../archives/sites'),
    list: path.join(__dirname, '../archives/sites.txt')
  };


  // console.log(res, asset, callback);

};

// switch (extname) {
//     case '.js':
//         contentType = 'text/javascript';
//         break;
//     case '.css':
//         contentType = 'text/css';
//         break;
//     case '.json':
//         contentType = 'application/json';
//         break;
//     case '.png':
//         contentType = 'image/png';
//         break;
//     case '.jpg':
//         contentType = 'image/jpg';
//         break;
//     case '.wav':
//         contentType = 'audio/wav';
//         break;
// }



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

    headers['Content-Type'] = getHeaders(ext);

    if (req.url === '/') {
      var fileName = '/index.html';
    } else {
      var fileName = req.url;
    }
    res.writeHead(200, headers);
    exports.serveAssets(res, fileName, function (data) {
      res.end(data);
    });
    // utils.sendResponse(response, {results: messages});
  }
};

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
exports.collectData = function(request, callback) {
  // console.log('request from collect data', request);
  var data = '';
  request.on('data', function(chunk) {
    data += chunk;
  });
  request.on('end', function() {
    data = data.split('=')[1]; //SPLIT DATA
    console.log('data is ', data); //MOVED INTO REQUEST.ON
    callback(data);
    // callback(JSON.parse(data)); //REMOVED JSON.parse
  });
};

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
