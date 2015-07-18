'use strict';

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

function uploadFactory($q, $cordovaFileTransfer) {
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

  var sum = function (array) {
    var sum = 0;
    for (var i in array) {
      if (array.hasOwnProperty(i)) {
        sum += array[i];
      }
    }
    return sum;
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

  var executeUpload = function (endpoint, allDeferred, progressInfo, options) {
    return function (file) {
      var filePath = file.path || file;
      var deferred = $q.defer();
      if (uploadedFiles[filePath] && !options.force) {
        progressInfo.files[filePath] = uploadedFiles[filePath].bytesSent;
        progressInfo.totalSize += uploadedFiles[filePath].bytesSent;
        progressInfo.currentCount++;
        deferred.resolve(uploadedFiles[filePath]);
      } else {
        $cordovaFileTransfer.upload(endpoint, filePath, options.http, options.trustHosts)
        .then(
          onSuccess(deferred, filePath, options),
          deferred.reject,
          onProgress(allDeferred, progressInfo, filePath)
        );
      }
      return deferred.promise;
    };
  };

  var getOptions = function (options) {
    options = options || {};
    options.http = options.http || {};
    options.trustHosts = options.trustHosts || false;
    return options;
  };

  return {
    upload: function (endpoint, files, options) {
      var allDeferred = $q.defer();
      options = getOptions(options);
      var progressInfo = {files: {}, totalSize: 0, currentCount: 0, totalCount: files.length};
      allSettled(files.map(executeUpload(endpoint, allDeferred, progressInfo, options)))
        .then(allDeferred.resolve, allDeferred.reject);
      return allDeferred.promise;
    }
  };
}

module.exports = ['$q', '$cordovaFileTransfer', uploadFactory];
