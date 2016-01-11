'use strict';

var imagePickerFactory = function ($parse) {
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
        var maxImagesCount;
        var replaceOnMaxReached = false;
        if ($attrs.maxImagesCount) {
          maxImagesCount = $parse($attrs.maxImagesCount)($scope.$parent);
        }
        if ($attrs.replaceOnMaxReached) {
          replaceOnMaxReached = $parse($attrs.replaceOnMaxReached)($scope.$parent);
        }
        var loadOptions = {
          thumbnail: {
            width: ($attrs.width && $parse($attrs.imgWidth)($scope.$parent)) || 128,
            height: ($attrs.height && $parse($attrs.imgHeight)($scope.$parent)) || 128
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

        var removeFirstImage = function () {
          var removed = $scope.selectedImages.splice($scope.selectedImages.length - 1);
          if (removed[0] && removed[0].id) {
            delete $scope.selection[removed[0].id];
          }
        };

        var updateSelection = function (image) {
          if ($scope.selection[image.id]) {
            $scope.$emit('ionimg:unselected', image);
            delete $scope.selection[image.id];
          } else {
            if ($scope.selectedImages.length >= maxImagesCount && replaceOnMaxReached) {
              removeFirstImage();
            }
            if (!maxImagesCount || $scope.selectedImages.length < maxImagesCount) {
              $scope.selection[image.id] = image;
              $scope.$emit('ionimg:selected', image);
            } else {
              $scope.$emit('ionimg:cannot-select', image);
            }
          }
        };

        $scope.toggleSelection = function (image) {
          updateSelection(image);
          $scope.selectedImages.splice(0, $scope.selectedImages.length);
          for (var id in $scope.selection) {
            if ($scope.selection.hasOwnProperty(id)) {
              $scope.selectedImages.push($scope.selection[id]);
            }
          }
          if (maxImagesCount && $scope.selectedImages.length >= maxImagesCount) {
            $scope.$emit('ionimg:max-reached');
          }
        };

        var addNewEntry = function (entry) {
          for (var j = 0; j < $scope.images.length; j++) {
            if ($scope.images[j].path === entry.path) {
              return;
            }
          }
          $scope.images.push(entry);
        };

        $scope.loadMore = function () {
          ionimgMediaLister.readLibrary(loadOptions).then(function (result) {
            for (var i = 0; i < result.entries.length; i++) {
              addNewEntry(result.entries[i]);
            }
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
