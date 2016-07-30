'use strict';

function getSize(image, maxSize) {
  var width = image.width;
  var height = image.height;
  if (width <= maxSize && height <= maxSize) {
    return [width, height];
  }
  if (width > height) {
    return [maxSize, Math.ceil(height * maxSize / width)];
  } else {
    return [Math.ceil(width * maxSize / height), maxSize];
  }
}

function imageResizeFactory($q) {
  return function resizeImage(fileContent, maxSize, extension) {
    maxSize = maxSize || 1024;

    var deferred = $q.defer();
    // NOTE: FileReader does not exist in prehistoric browsers
    // The file can be used as a blob, so we resolve directly
    if (typeof FileReader !== 'function') {
      return deferred.resolve(fileContent);
    }

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    function resolveBlob(blob) {
      var fileReader = new FileReader();
      fileReader.onload = function () {
        deferred.resolve(this.result);
      };
      fileReader.readAsDataURL(blob);
    }


    function handleImageLoad(image) {
      var size = getSize(image, maxSize);
      var width = size[0];
      var height = size[1];
      canvas.width = width;
      canvas.height = height;
      context.drawImage(image, 0, 0, width, height);
      var args = [function (blob) { resolveBlob(blob); }];
      if (extension === 'jpg') {
        args.push('image/jpeg');
        args.push(0.9);
      }
      canvas.toBlob.apply(canvas, args);
    }

    var image = new Image();
    image.onload = function () {
      handleImageLoad(image);
    };
    image.src = fileContent;

    return deferred.promise;
  };
}

module.exports = ['$q', imageResizeFactory];
