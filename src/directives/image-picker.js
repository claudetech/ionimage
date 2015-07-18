'use strict';

var imagePickerFactory = function ($interpolate) {
  return {
    template: require('../templates/image-picker.jade')(),
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
