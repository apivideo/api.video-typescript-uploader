[![badge](https://img.shields.io/twitter/follow/api_video?style=social)](https://twitter.com/intent/follow?screen_name=api_video)

[![badge](https://img.shields.io/github/stars/apivideo/typescript-video-uploader?style=social)](https://github.com/apivideo/typescript-video-uploader)

[![badge](https://img.shields.io/discourse/topics?server=https%3A%2F%2Fcommunity.api.video)](https://community.api.video)

![](https://github.com/apivideo/API_OAS_file/blob/master/apivideo_banner.png)

api.video is an API that encodes on the go to facilitate immediate playback, enhancing viewer streaming experiences across multiple devices and platforms. You can stream live or on-demand online videos within minutes.

# api.video video uploader
![npm](https://img.shields.io/npm/v/@api.video/video-uploader) ![ts](https://badgen.net/badge/-/TypeScript/blue?icon=typescript&label)

Typescript library to upload videos to api.video using delegated upload token (or usual access token) from the front-end.

# Usage

## Installation method #1: requirejs

If you use requirejs you can add the library as a dependency to your project with 

```sh
$ npm install --save @api.video/video-uploader
```

You can then use the library in your script: 

```javascript
var { VideoUploader } = require('@api.video/video-uploader');

var uploader = new VideoUploader({
    file: files[0],
    uploadToken: "YOUR_DELEGATED_TOKEN"
    // ... other optional options
}); 
```

## Installation method #2: typescript

If you use Typescript you can add the library as a dependency to your project with 

```sh
$ npm install --save @api.video/video-uploader
```

You can then use the library in your script: 

```typescript
import { VideoUploader } from '@api.video/video-uploader'

const uploader = new VideoUploader({
    file: files[0],
    uploadToken: "YOUR_DELEGATED_TOKEN"
    // ... other optional options
});
```


## Simple include in a javascript project

Include the library in your HTML file like so:

```html
<head>
    ...
    <script src="https://unpkg.com/@api.video/video-uploader" defer></script>
</head>
```

Then, once the `window.onload` event has been trigered, create your player using `new VideoUploader()`:
```html
...
<form>
    <input type="file" id="input" onchange="uploadFile(this.files)">
</form>
<script type="text/javascript">
    function uploadFile(files) {
        new VideoUploader({
            file: files[0],
            uploadToken: "YOUR_DELEGATED_TOKEN"
        }).upload();
    }
</script>
```

# Instanciation

## Options 

The upload library is instanciated using an `options` object. Options to provide depend on the way you want to authenticate to the API: either using a delegated upload token (recommanded), or using a usual access token. 

### Using a delegated upload token (recommended):

Using delegated upload tokens for authentication is best options when uploading from the client side. To know more about delegated upload token, read the dedicated article on api.video's blog: [Delegated Uploads](https://api.video/blog/tutorials/delegated-uploads).


|                   Option name | Mandatory | Type   | Description             |
| ----------------------------: | --------- | ------ | ----------------------- |
|                   uploadToken | **yes**   | string | your upload token       |
|                       videoId | no        | string | id of an existing video |
| _common options (see bellow)_ |           |        |                         |

### Using an access token (discouraged):

**Warning**: be aware that exposing your access token client-side can lead to huge security issues. Use this method only if you know what you're doing :).


|                   Option name | Mandatory | Type   | Description             |
| ----------------------------: | --------- | ------ | ----------------------- |
|                   accessToken | **yes**   | string | your access token       |
|                       videoId | **yes**   | string | id of an existing video |
| _common options (see bellow)_ |           |        |                         |


### Common options


| Option name | Mandatory | Type   | Description                                                                |
| ----------: | --------- | ------ | -------------------------------------------------------------------------- |
|        file | **yes**   | File   | the file you want to upload                                                |
|   chunkSize | no        | number | number of bytes of each upload chunk (default: 50MB, min: 5MB, max: 128MB) |
|     apiHost | no        | string | api.video host (default: ws.api.video)                                     |
|     retries | no        | number | number of retries when an API call fails (default: 5)                      |


## Example

```javascript
    const uploader = new VideoUploader({
        file: files[0],
        uploadToken: "YOUR_DELEGATED_TOKEN",
        chunkSize: 1024*1024*10, // 10MB
        retries: 10,
    });
```

# Methods

## `upload()`

The upload() method starts the upload. It takes no parameter. It returns a Promise that resolves once the file is uploaded. If an API call fails more than the specified number of retries, then the promise is rejected.
On success, the promise embeds the `video` object returned by the API.
On fail, the promise embeds the status code & error message returned by the API.

### Example

```javascript
    // ... uploader instanciation

    uploader.upload()
        .then((video) => console.log(video))
        .catch((error) => console.log(error.status, error.message));
```

## `onProgress()`

The onProgress() method let you defined an upload progress listener. It takes a callback function with one parameter: the onProgress events.
An onProgress event contains the following attributes:
- uploadedBytes (number): total number of bytes uploaded for this upload
- totalBytes (number): total size of the file
- chunksCount (number): number of upload chunks 
- chunksBytes (number): size of a chunk
- currentChunk (number): index of the chunk being uploaded
- currentChunkUploadedBytes (number): number of bytes uploaded for the current chunk

### Example

```javascript
    // ... uploader instanciation
    
    uploader.onProgress((event) => {
        console.log(`total number of bytes uploaded for this upload: ${event.uploadedBytes}.`);
        console.log(`total size of the file: ${event.totalBytes}.`);
        console.log(`number of upload chunks: ${event.chunksCount} .`);
        console.log(`size of a chunk: ${event.chunksBytes}.`);
        console.log(`index of the chunk being uploaded: ${event.currentChunk}.`);
        console.log(`number of bytes uploaded for the current chunk: ${event.currentChunkUploadedBytes}.`);
    });
```
