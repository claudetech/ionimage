/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(1);

	__webpack_require__(2);

	module.exports = angular.module('ionimage', [
	  'ionic',
	  'ngCordova'
	])
	.directive('ionimgPicker', __webpack_require__(6))
	.provider('ionimgUploader', __webpack_require__(10))
	.factory('ionimgMediaLister', __webpack_require__(11));


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = angular;

/***/ },
/* 2 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var imagePickerFactory = function ($interpolate) {
	  return {
	    template: __webpack_require__(7)(),
	    restrict: 'EA',
	    scope: {
	      selectedImages: '=?'
	    },
	    controller: [
	      '$scope',
	      '$attrs',
	      'ionimgMediaLister',
	      function ($scope, $attrs, ionimgMediaLister) {
	        var loadOptions = {
	          thumbnail: {
	            width: ($attrs.width && $interpolate($attrs.imgWidth)($scope.$parent)) || 128,
	            height: ($attrs.height && $interpolate($attrs.imgHeight)($scope.$parent)) || 128
	          },
	          mediaTypes: ['image']
	        };

	        $scope.selection = {};

	        $scope.canLoadMore = true;
	        $scope.selectionStatus = {};
	        $scope.images = [];
	        $scope.selectedImages = $scope.selectedImages || [];

	        $scope.selectedImages.forEach(function (image) {
	          $scope.selection[image.id] = image;
	        });

	        $scope.toggleSelection = function (image) {
	          if ($scope.selection[image.id]) {
	            delete $scope.selection[image.id];
	          } else {
	            $scope.selection[image.id] = image;
	          }
	          $scope.selectedImages.splice(0, $scope.selectedImages.length);
	          for (var id in $scope.selection) {
	            if ($scope.selection.hasOwnProperty(id)) {
	              $scope.selectedImages.push($scope.selection[id]);
	            }
	          }
	        };

	        $scope.loadMore = function () {
	          ionimgMediaLister.readLibrary(loadOptions).then(function (result) {
	            $scope.images = $scope.images.concat(result.entries);
	            $scope.canLoadMore = result.entries.length > 0;
	            loadOptions = result.nextOptions;
	          }.bind(this), function (err) {
	            $scope.$emit('image-picker:error', err);
	          }).finally(function () {
	            $scope.$broadcast('scroll.infiniteScrollComplete');
	          });
	        };
	        $scope.loadMore();
	      }
	    ]
	  };
	};

	module.exports = ['$interpolate', imagePickerFactory];


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(8);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;

	buf.push("<div class=\"_ionimg-picker\"><div ng-repeat=\"image in images\" ng-class=\"{selected: selection[image.id]}\" ng-click=\"toggleSelection(image)\" class=\"image-wrapper\"><img ng-src=\"{{image.thumbnailPath}}\" class=\"image\"/></div><ion-infinite-scroll ng-if=\"canLoadMore\" on-infinite=\"loadMore()\" distance=\"1%\"></ion-infinite-scroll></div>");;return buf.join("");
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Merge two attribute objects giving precedence
	 * to values in object `b`. Classes are special-cased
	 * allowing for arrays and merging/joining appropriately
	 * resulting in a string.
	 *
	 * @param {Object} a
	 * @param {Object} b
	 * @return {Object} a
	 * @api private
	 */

	exports.merge = function merge(a, b) {
	  if (arguments.length === 1) {
	    var attrs = a[0];
	    for (var i = 1; i < a.length; i++) {
	      attrs = merge(attrs, a[i]);
	    }
	    return attrs;
	  }
	  var ac = a['class'];
	  var bc = b['class'];

	  if (ac || bc) {
	    ac = ac || [];
	    bc = bc || [];
	    if (!Array.isArray(ac)) ac = [ac];
	    if (!Array.isArray(bc)) bc = [bc];
	    a['class'] = ac.concat(bc).filter(nulls);
	  }

	  for (var key in b) {
	    if (key != 'class') {
	      a[key] = b[key];
	    }
	  }

	  return a;
	};

	/**
	 * Filter null `val`s.
	 *
	 * @param {*} val
	 * @return {Boolean}
	 * @api private
	 */

	function nulls(val) {
	  return val != null && val !== '';
	}

	/**
	 * join array as classes.
	 *
	 * @param {*} val
	 * @return {String}
	 */
	exports.joinClasses = joinClasses;
	function joinClasses(val) {
	  return (Array.isArray(val) ? val.map(joinClasses) :
	    (val && typeof val === 'object') ? Object.keys(val).filter(function (key) { return val[key]; }) :
	    [val]).filter(nulls).join(' ');
	}

	/**
	 * Render the given classes.
	 *
	 * @param {Array} classes
	 * @param {Array.<Boolean>} escaped
	 * @return {String}
	 */
	exports.cls = function cls(classes, escaped) {
	  var buf = [];
	  for (var i = 0; i < classes.length; i++) {
	    if (escaped && escaped[i]) {
	      buf.push(exports.escape(joinClasses([classes[i]])));
	    } else {
	      buf.push(joinClasses(classes[i]));
	    }
	  }
	  var text = joinClasses(buf);
	  if (text.length) {
	    return ' class="' + text + '"';
	  } else {
	    return '';
	  }
	};


	exports.style = function (val) {
	  if (val && typeof val === 'object') {
	    return Object.keys(val).map(function (style) {
	      return style + ':' + val[style];
	    }).join(';');
	  } else {
	    return val;
	  }
	};
	/**
	 * Render the given attribute.
	 *
	 * @param {String} key
	 * @param {String} val
	 * @param {Boolean} escaped
	 * @param {Boolean} terse
	 * @return {String}
	 */
	exports.attr = function attr(key, val, escaped, terse) {
	  if (key === 'style') {
	    val = exports.style(val);
	  }
	  if ('boolean' == typeof val || null == val) {
	    if (val) {
	      return ' ' + (terse ? key : key + '="' + key + '"');
	    } else {
	      return '';
	    }
	  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
	    if (JSON.stringify(val).indexOf('&') !== -1) {
	      console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' +
	                   'will be escaped to `&amp;`');
	    };
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will eliminate the double quotes around dates in ' +
	                   'ISO form after 2.0.0');
	    }
	    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
	  } else if (escaped) {
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will stringify dates in ISO form after 2.0.0');
	    }
	    return ' ' + key + '="' + exports.escape(val) + '"';
	  } else {
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will stringify dates in ISO form after 2.0.0');
	    }
	    return ' ' + key + '="' + val + '"';
	  }
	};

	/**
	 * Render the given attributes object.
	 *
	 * @param {Object} obj
	 * @param {Object} escaped
	 * @return {String}
	 */
	exports.attrs = function attrs(obj, terse){
	  var buf = [];

	  var keys = Object.keys(obj);

	  if (keys.length) {
	    for (var i = 0; i < keys.length; ++i) {
	      var key = keys[i]
	        , val = obj[key];

	      if ('class' == key) {
	        if (val = joinClasses(val)) {
	          buf.push(' ' + key + '="' + val + '"');
	        }
	      } else {
	        buf.push(exports.attr(key, val, false, terse));
	      }
	    }
	  }

	  return buf.join('');
	};

	/**
	 * Escape the given string of `html`.
	 *
	 * @param {String} html
	 * @return {String}
	 * @api private
	 */

	var jade_encode_html_rules = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;'
	};
	var jade_match_html = /[&<>"]/g;

	function jade_encode_char(c) {
	  return jade_encode_html_rules[c] || c;
	}

	exports.escape = jade_escape;
	function jade_escape(html){
	  var result = String(html).replace(jade_match_html, jade_encode_char);
	  if (result === '' + html) return html;
	  else return result;
	};

	/**
	 * Re-throw the given `err` in context to the
	 * the jade in `filename` at the given `lineno`.
	 *
	 * @param {Error} err
	 * @param {String} filename
	 * @param {String} lineno
	 * @api private
	 */

	exports.rethrow = function rethrow(err, filename, lineno, str){
	  if (!(err instanceof Error)) throw err;
	  if ((typeof window != 'undefined' || !filename) && !str) {
	    err.message += ' on line ' + lineno;
	    throw err;
	  }
	  try {
	    str = str || __webpack_require__(9).readFileSync(filename, 'utf8')
	  } catch (ex) {
	    rethrow(err, null, lineno)
	  }
	  var context = 3
	    , lines = str.split('\n')
	    , start = Math.max(lineno - context, 0)
	    , end = Math.min(lines.length, lineno + context);

	  // Error context
	  var context = lines.slice(start, end).map(function(line, i){
	    var curr = i + start + 1;
	    return (curr == lineno ? '  > ' : '    ')
	      + curr
	      + '| '
	      + line;
	  }).join('\n');

	  // Alter exception message
	  err.path = filename;
	  err.message = (filename || 'Jade') + ':' + lineno
	    + '\n' + context + '\n\n' + err.message;
	  throw err;
	};

	exports.DebugItem = function DebugItem(lineno, filename) {
	  this.lineno = lineno;
	  this.filename = filename;
	}


/***/ },
/* 9 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	var defaultEndpoint = 'http://localhost:3000/upload';

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

	  var uploadFactory = function ($q, $cordovaFileTransfer) {
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

	    var executeUpload = function (allDeferred, progressInfo, options) {
	      var handleUpload = function (deferred, filePath) {
	        var url = options.endpoint || endpoint;
	        if (options.http.query) {
	          url += (url.indexOf('?') > -1 ? '&' : '?') + options.http.query;
	        }
	        $cordovaFileTransfer.upload(url, filePath, options.http, options.trustHosts)
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
	          handleUpload(deferred, filePath);
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

	  this.$get = ['$q', '$cordovaFileTransfer', uploadFactory];
	};

	module.exports = uploadProvider;


/***/ },
/* 11 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);