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

  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change oen.)

exports.serveAssets = function(res, asset, callback) {
  var encoding = 'utf8';

  fs.readFile(archive.paths.siteAssets + '/' + asset, encoding, (err, data) => {
    // if file not found in /web/public
    if (err) {
      fs.readFile(archive.paths.archivedSites + '/' + asset, encoding, (err, data) => {
        // if not found in /archives/sites
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
  exports.sendResponse(res, 'Page Not Found', 404);
};

exports.sendRedirect = function(res, location, status) {
  status = status || 302;
  res.writeHead(status, {Location: location});
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
    console.log('req.url', req.url);
    var url;
    if (req.url === '/') {
      url = '/index.html';
    } else {
      url = req.url.slice(1);
    }
    console.log('url ---', url);
    console.log('-----------------------');
    exports.serveAssets(res, url, function (data) {
    });
  },
  'POST': function(req, res) {
    collectData(req, function(url) {

      archive.isUrlArchived(url, function(isFound) {
        if (isFound) {
          exports.serveAssets(res, url);
        } else {
          archive.isUrlInList(url, function(isFound) {
            if (!isFound) {
              archive.addUrlToList(url);
            }
            exports.sendRedirect(res, '/loading.html');
          });
        }
      });
    });
  }
};
