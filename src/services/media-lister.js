'use strict';

function mediaListerFactory($window, $q) {
  return {
    readLibrary: function (options) {
      options = options || {};
      var deferred = $q.defer();
      $window.mediaLister.readLibrary(options, deferred.resolve, deferred.reject);
      return deferred.promise;
    }
  };
}

module.exports = ['$window', '$q', mediaListerFactory];
