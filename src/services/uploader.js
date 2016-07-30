'use strict';

var defaultEndpoint = 'http://localhost:3000/upload';
var resizeImage = require('./resize-image');


var mapValues = function (obj, callback) {
  if (typeof obj.map === 'function') {
    return obj.map(callback);
  }

  var ret = {};
  Object.keys(obj).forEach(function (key) {
    ret[key] = callback(obj[key], key);
  });
  return ret;
};

var sum = function (array) {
  var sum = 0;
  for (var i in array) {
    if (array.hasOwnProperty(i)) {
      sum += array[i];
    }
  }
  return sum;
};

var queryToString = function (query) {
  var queries = [];
  for (var key in query) {
    if (query.hasOwnProperty(key)) {
      queries.push(encodeURIComponent(key) + '=' + encodeURIComponent(query[key]));
    }
  }
  return queries.join('&');
};

var uploadProvider = function () {
  var endpoint = defaultEndpoint;

  this.setEndpoint = function (v) {
    endpoint = v;
  };

  var getOptions = function (options) {
    options = options || {};
    options.http = options.http || {};
    options.trustHosts = options.trustHosts || false;
    if (options.http.query && typeof options.http.query !== 'string') {
      options.http.query = queryToString(options.http.query);
    }
    return options;
  };

  var uploadFactory = function ($q, $window, $timeout, resizeImage) {
    var uploadedFiles = {};

    var allSettled = function (promises) {
      return $q.all(mapValues(promises, function (promiseOrValue) {
        if (!promiseOrValue.then) {
          return {state: 'fulfilled', value: promiseOrValue};
        }
        return promiseOrValue.then(function (value) {
          return {state: 'fulfilled', value: value};
        }, function (reason) {
          return {state: 'rejected', reason: reason};
        });
      }));
    };

    var onSuccess = function (deferred, filePath, options) {
      return function (result) {
        uploadedFiles[filePath] = result;
        result.filePath = filePath;
        if (options.parseResponse) {
          result.response = JSON.parse(result.response);
        }
        if (options.processResult) {
          result = options.processResult(result);
        }
        deferred.resolve(result);
      };
    };

    var onProgress = function (deferred, progressInfo, filePath) {
      return function (progress) {
        if (!progressInfo.files[filePath]) {
          progressInfo.totalSize += progress.total;
          progressInfo.currentCount++;
        }
        progressInfo.files[filePath] = progress.loaded;
        var currentProgress = {
          loaded: sum(progressInfo.files),
          total: progressInfo.totalSize,
          currentCount: progressInfo.currentCount,
          totalCount: progressInfo.totalCount
        };
        deferred.notify(currentProgress);
      };
    };

    var handleUploaded = function (deferred, filePath, progressInfo) {
      progressInfo.files[filePath] = uploadedFiles[filePath].bytesSent;
      progressInfo.totalSize += uploadedFiles[filePath].bytesSent;
      progressInfo.currentCount++;
      deferred.resolve(uploadedFiles[filePath]);
    };

    // https://github.com/driftyco/ng-cordova/blob/master/src/plugins/fileTransfer.js
    var upload = function (server, filePath, options, trustAllHosts) {
      var q = $q.defer();
      var ft = new $window.FileTransfer();
      var uri = (options && options.encodeURI === false) ? server : encodeURI(server);

      if (options && options.timeout !== undefined && options.timeout !== null) {
        $timeout(function () {
          ft.abort();
        }, options.timeout);
        options.timeout = null;
      }

      ft.onprogress = function (progress) {
        q.notify(progress);
      };

      q.promise.abort = function () {
        ft.abort();
      };

      ft.upload(filePath, uri, q.resolve, q.reject, options, trustAllHosts);
      return q.promise;
    };

    var executeUpload = function (allDeferred, progressInfo, options) {
      var handleUpload = function (deferred, filePath, content) {
        var url = options.endpoint || endpoint;
        if (options.http.query) {
          url += (url.indexOf('?') > -1 ? '&' : '?') + options.http.query;
        }
        resizeImage(content || filePath, options.maxSize, options.extension)
        .then(function (file) {
          return upload(url, file, options.http, options.trustHosts);
        })
        .then(onSuccess(deferred, filePath, options),
          deferred.reject,
          onProgress(allDeferred, progressInfo, filePath));
      };

      return function (file) {
        var filePath = file.path || file;
        var deferred = $q.defer();
        if (uploadedFiles[filePath] && !options.force) {
          handleUploaded(deferred, filePath, progressInfo);
        } else {
          handleUpload(deferred, filePath, file.content);
        }
        return deferred.promise;
      };
    };

    return {
      upload: function (files, options) {
        var allDeferred = $q.defer();
        options = getOptions(options);
        var progressInfo = {files: {}, totalSize: 0, currentCount: 0, totalCount: files.length};
        allSettled(files.map(executeUpload(allDeferred, progressInfo, options)))
          .then(allDeferred.resolve, allDeferred.reject);
        return allDeferred.promise;
      }
    };
  };

  this.$get = ['$q', '$window', '$timeout', 'ionimgResize', uploadFactory];
};

module.exports = uploadProvider;
