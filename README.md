# ionimage

Library to easily get images from user and upload them using [ionic](http://ionicframework.com/).

## Requirements

This library depends on

* [ionic](http://ionicframework.com/)
* [cordova-plugin-file-transfer](https://github.com/apache/cordova-plugin-file-transfer)
* [cordova-plugin-media-lister](https://github.com/claudetech/cordova-plugin-media-lister)

## Usage

### `ionimgMediaLister` service

This provides a direct binding to the [media lister plugin](cordova-plugin-media-lister) used to list images. The only change in the API is that
`readLibrary` returns a `$q` promise.

### `ionimgPicker` directive

This directive shows a selectable list of the images in the user gallery.
If you want the basic style provided you include [ionimage.css](dist/ionimage.css).

```html
<ionimg-picker selected-images="myImages" img-width="200" img-height="200" />
```

The `selected-images` will contain the images selected by the user.
`img-width` and `img-height` are used to generate the thumbnails, but you need to modify the style yourself.


NOTE: on Android, images are not loaded in memory, and therefore, generated thumbnails will not be exactly the given size. See [Loading large bitmaps efficiently](http://developer.android.com/training/displaying-bitmaps/load-bitmap.html) for more info.

### `ionimgUploader` service

This is a wrapper around [fileTransfer](https://github.com/apache/cordova-plugin-file-transfer)
It takes a list of image as returned by `ionimgMediaLister` and upload them to the given URL.

```
var uploadUrl = 'http://example.com/upload'
ionimgUploader.upload(uploadUrl, this.voice.images, {parseResponse: true})
      .then(function (res) {
        console.log(res);
        // [{
        //   state: 'fulfilled',
        //   value: {
        //     bytesSent: 163944,
        //     objectId: "",
        //     filePath: "/storage/sdcard1/saved_SDdata/SD_pictures/1377855875036.jpg",
        //     responseCode: 200,
        //     response: "whatever the server returned"
        //   }
        // }, {
        //   state: 'rejected',
        //   reason: {
        //     code: 1,
        //     exception: "whatever error occured",
        //     source: "/storage/sdcard1/saved_SDdata/SD_pictures/1377855875036:fail.jpg"
        //   }
        // }]
      }, null, function (progress) {
        console.log(progress);
        // {
        //   loaded: 2230966, // total bytes uploaded
        //   total: 2231005,  // total bytes to upload (for file which already started)
        //   currentCount: 3, // number of files that have already started to upload
        //   totalCount: 4    // total number of files to upload
        // }
      });
```

By default, the image that have already been updated are cached (using their path as key), so they do not get uploaded multiple times. You can pass `force: true` to disable this behavior.

## Status

The library is not stable yet, I suggest you wait a little before using this seriously.

The iOS version of the [required cordova plugin](https://github.com/claudetech/cordova-plugin-media-lister) is still in development.
