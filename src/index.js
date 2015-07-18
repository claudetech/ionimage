'use strict';

var angular = require('angular');

require('./stylesheets/style.scss');

module.exports = angular.module('ionimage', [
  'ionic',
  'ngCordova'
])
.directive('ionimgPicker', require('./directives/image-picker'))
.factory('ionimgUploader', require('./services/uploader'))
.factory('ionimgMediaLister', require('./services/media-lister'));
