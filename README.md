[![badge](https://img.shields.io/twitter/follow/api_video?style=social)](https://twitter.com/intent/follow?screen_name=api_video) &nbsp; [![badge](https://img.shields.io/github/stars/apivideo/api.video-typescript-uploader?style=social)](https://github.com/apivideo/api.video-typescript-uploader) &nbsp; [![badge](https://img.shields.io/discourse/topics?server=https%3A%2F%2Fcommunity.api.video)](https://community.api.video)
![](https://github.com/apivideo/.github/blob/main/assets/apivideo_banner.png)
<h1 align="center">api.video typescript video uploader</h1>

![npm](https://img.shields.io/npm/v/@api.video/video-uploader) ![ts](https://badgen.net/badge/-/TypeScript/blue?icon=typescript&label)


[api.video](https://api.video) is the video infrastructure for product builders. Lightning fast video APIs for integrating, scaling, and managing on-demand & low latency live streaming features in your app.

# Table of contents

- [Table of contents](#table-of-contents)
- [Project description](#project-description)
- [Getting started](#getting-started)
  - [Installation](#installation)
    - [Installation method #1: requirejs](#installation-method-1-requirejs)
    - [Installation method #2: typescript](#installation-method-2-typescript)
    - [Simple include in a javascript project](#simple-include-in-a-javascript-project)
- [Documentation - Standard upload](#documentation---standard-upload)
  - [Instanciation](#instanciation)
    - [Options](#options)
      - [Using a delegated upload token (recommended):](#using-a-delegated-upload-token-recommended)
      - [Using an access token (discouraged):](#using-an-access-token-discouraged)
      - [Using an API key (**strongly** discouraged):](#using-an-api-key-strongly-discouraged)
      - [Common options](#common-options)
    - [Example](#example)
  - [Methods](#methods)
    - [`upload()`](#upload)
    - [`onProgress()`](#onprogress)
    - [`onPlayable()`](#onplayable)
- [Documentation - Progressive upload](#documentation---progressive-upload)
  - [Instanciation](#instanciation-1)
    - [Options](#options-1)
      - [Using a delegated upload token (recommended):](#using-a-delegated-upload-token-recommended-1)
      - [Using an access token (discouraged):](#using-an-access-token-discouraged-1)
      - [Common options](#common-options-1)
    - [Example](#example-1)
  - [Methods](#methods-1)
    - [`uploadPart(file: Blob)`](#uploadpartfile-blob)
    - [`uploadLastPart(file: Blob)`](#uploadlastpartfile-blob)
    - [`onProgress()`](#onprogress-1)
    - [`onPlayable()`](#onplayable-1)

# Project description

Typescript library to upload videos to api.video using delegated upload token (or usual access token) from the front-end. 

It allows you to upload videos in two ways:
- standard upload: to send a whole video file in one go
- progressive upload: to send a video file by chunks, without needing to know the final size of the video file

# Getting started

## Installation

### Installation method #1: requirejs

If you use requirejs you can add the library as a dependency to your project with 

```sh
$ npm install --save @api.video/video-uploader
```

You can then use the library in your script: 

```javascript
// standard upload:
var { VideoUploader } = require('@api.video/video-uploader');

var uploader = new VideoUploader({
    // ... (see bellow)
}); 

// progressive upload:
var { ProgressiveUploader } = require('@api.video/video-uploader');

var uploader = new ProgressiveUploader({
    // ... (see bellow)
}); 
```

### Installation method #2: typescript

If you use Typescript you can add the library as a dependency to your project with 

```sh
$ npm install --save @api.video/video-uploader
```

You can then use the library in your script: 

```typescript
// standard upload:
import { VideoUploader } from '@api.video/video-uploader'

const uploader = new VideoUploader({
    // ... (see bellow)
});

// progressive upload:
import { ProgressiveUploader } from '@api.video/video-uploader'

const uploader = new ProgressiveUploader({
    // ... (see bellow)
});
```


### Simple include in a javascript project

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

# Documentation - Standard upload

## Instanciation

### Options 

The upload library is instanciated using an `options` object. Options to provide depend on the way you want to authenticate to the API: either using a delegated upload token (recommanded), or using a usual access token. 

#### Using a delegated upload token (recommended):

Using delegated upload tokens for authentication is best options when uploading from the client side. To know more about delegated upload token, read the dedicated article on api.video's blog: [Delegated Uploads](https://api.video/blog/tutorials/delegated-uploads).


|                   Option name | Mandatory | Type   | Description             |
| ----------------------------: | --------- | ------ | ----------------------- |
|                   uploadToken | **yes**   | string | your upload token       |
|                       videoId | no        | string | id of an existing video |
| _common options (see bellow)_ |           |        |                         |

#### Using an access token (discouraged):

**Warning**: be aware that exposing your access token client-side can lead to huge security issues. Use this method only if you know what you're doing :).


|                   Option name | Mandatory | Type   | Description                                                                                                                                     |
| ----------------------------: | --------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
|                   accessToken | **yes**   | string | your access token                                                                                                                               |
|                  refreshToken | **no**    | string | your refresh token (please not that if you don't provide a refresh token, your upload may fails due to the access token lifetime of 60 minutes) |
|                       videoId | **yes**   | string | id of an existing video                                                                                                                         |
| _common options (see bellow)_ |           |        |                                                                                                                                                 |


#### Using an API key (**strongly** discouraged):

**Warning**: be aware that exposing your API key client-side can lead to huge security issues. Use this method only if you know what you're doing :).


|                   Option name | Mandatory | Type   | Description             |
| ----------------------------: | --------- | ------ | ----------------------- |
|                       API Key | **yes**   | string | your api.video API key  |
|                       videoId | **yes**   | string | id of an existing video |
| _common options (see bellow)_ |           |        |                         |


#### Common options


|   Option name    | Mandatory | Type                                                            | Description                                                                                                                              |
| ---------------: | --------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
|          file    | **yes**   | File                                                            | the file you want to upload                                                                                                              |
|     videoName    | no        | string                                                          | the name of your video (overrides the original file name for regular uploads, overrides the default "file" name for progressive uploads) |
|     chunkSize    | no        | number                                                          | number of bytes of each upload chunk (default: 50MB, min: 5MB, max: 128MB)                                                               |
|       apiHost    | no        | string                                                          | api.video host (default: ws.api.video)                                                                                                   |
|       retries    | no        | number                                                          | number of retries when an API call fails (default: 5)                                                                                    |
| retryStrategy    | no        | (retryCount: number, error: VideoUploadError) => number \| null | function that returns the number of ms to wait before retrying a failed upload. Returns null to stop retrying                            |
| maxVideoDuration | no        | number                                                          | maximum duration allowed for the file (in seconds)                                                                                       |


### Example

```javascript
    const uploader = new VideoUploader({
        file: files[0],
        uploadToken: "YOUR_DELEGATED_TOKEN",
        chunkSize: 1024*1024*10, // 10MB
        retries: 10,
    });
```

## Methods

### `upload()`

The upload() method starts the upload. It takes no parameter. It returns a Promise that resolves once the file is uploaded. If an API call fails more than the specified number of retries, then the promise is rejected.
On success, the promise embeds the `video` object returned by the API.
On fail, the promise embeds the status code & error message returned by the API.

**Example**

```javascript
    // ... uploader instanciation

    uploader.upload()
        .then((video) => console.log(video))
        .catch((error) => console.log(error.status, error.message));
```

### `onProgress()`

The onProgress() method let you defined an upload progress listener. It takes a callback function with one parameter: the onProgress events.
An onProgress event contains the following attributes:
- uploadedBytes (number): total number of bytes uploaded for this upload
- totalBytes (number): total size of the file
- chunksCount (number): number of upload chunks 
- chunksBytes (number): size of a chunk
- currentChunk (number): index of the chunk being uploaded
- currentChunkUploadedBytes (number): number of bytes uploaded for the current chunk

**Example**

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


### `onPlayable()`

The onPlayable() method let you defined a listener that will be called when the video is playable. It takes a callback function with one parameter: the `video` object returned by the API.

**Example**

```html
    <div id="player-container"></div>

    <script>
        // ... uploader instanciation
    
        uploader.onPlayable((video) => {
            // the video is playable, we can display the player
            document.getElementById('player-container').innerHTML = v.assets.iframe;
        });
    </script>
```

# Documentation - Progressive upload


## Instanciation

### Options 

The progressive upload object is instanciated using an `options` object. Options to provide depend on the way you want to authenticate to the API: either using a delegated upload token (recommanded), or using a usual access token. 

#### Using a delegated upload token (recommended):

Using delegated upload tokens for authentication is best options when uploading from the client side. To know more about delegated upload token, read the dedicated article on api.video's blog: [Delegated Uploads](https://api.video/blog/tutorials/delegated-uploads).


|                   Option name | Mandatory | Type   | Description             |
| ----------------------------: | --------- | ------ | ----------------------- |
|                   uploadToken | **yes**   | string | your upload token       |
|                       videoId | no        | string | id of an existing video |
| _common options (see bellow)_ |           |        |                         |

#### Using an access token (discouraged):

**Warning**: be aware that exposing your access token client-side can lead to huge security issues. Use this method only if you know what you're doing :).


|                   Option name | Mandatory | Type   | Description             |
| ----------------------------: | --------- | ------ | ----------------------- |
|                   accessToken | **yes**   | string | your access token       |
|                       videoId | **yes**   | string | id of an existing video |
| _common options (see bellow)_ |           |        |                         |


#### Common options


|       Option name           | Mandatory | Type                                                            | Description                                                                                                                                            |
| --------------------------: | --------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
|           apiHost           | no        | string                                                          | api.video host (default: ws.api.video)                                                                                                                 |
|           retries           | no        | number                                                          | number of retries when an API call fails (default: 5)                                                                                                  |
|     retryStrategy           | no        | (retryCount: number, error: VideoUploadError) => number \| null | function that returns the number of ms to wait before retrying a failed upload. Returns null to stop retrying                                          |
| preventEmptyParts           | no        | boolean                                                         | if true, the upload will succeed even if an empty Blob is passed to uploadLastPart(). This may alter performances a bit in some cases (default: false) |
| mergeSmallPartsBeforeUpload | no        | boolean                                                         | if false, parts smaller than 5MB will not be merged before upload, resulting in an error (default: true)                                               |


### Example

```javascript
    const uploader = new ProgressiveUploader({
        uploadToken: "YOUR_DELEGATED_TOKEN",
        retries: 10,
    });
```

## Methods

### `uploadPart(file: Blob)`

The upload() method starts the upload. It takes no parameter. It returns a Promise that resolves once the file is uploaded. If an API call fails more than the specified number of retries, then the promise is rejected.
On success, the promise embeds the `video` object returned by the API.
On fail, the promise embeds the status code & error message returned by the API.

**Example**

```javascript
    // ... uploader instanciation

    uploader.uploadPart(blob)
        .catch((error) => console.log(error.status, error.message));
```

### `uploadLastPart(file: Blob)`

The upload() method starts the upload. It takes no parameter. It returns a Promise that resolves once the file is uploaded. If an API call fails more than the specified number of retries, then the promise is rejected.
On success, the promise embeds the `video` object returned by the API.
On fail, the promise embeds the status code & error message returned by the API.

**Example**

```javascript
    // ... uploader instanciation

    uploader.uploadLastPart(blob)
        .then((video) => console.log(video))
        .catch((error) => console.log(error.status, error.message));
```

### `onProgress()`

The onProgress() method let you defined an upload progress listener. It takes a callback function with one parameter: the onProgress events.
An onProgress event contains the following attributes:
- uploadedBytes (number): total number of bytes uploaded for this upload
- totalBytes (number): total size of the file

**Example**

```javascript
    // ... uploader instanciation
    
    uploader.onProgress((event) => {
        console.log(`total number of bytes uploaded for this upload: ${event.uploadedBytes}.`);
        console.log(`total size of the file: ${event.totalBytes}.`);
    });
```

### `onPlayable()`

The onPlayable() method let you defined a listener that will be called when the video is playable. It takes a callback function with one parameter: the `video` object returned by the API.

**Example**

```html
    <div id="player-container"></div>

    <script>
        // ... uploader instanciation
    
        uploader.onPlayable((video) => {
            // the video is playable, we can display the player
            document.getElementById('player-container').innerHTML = v.assets.iframe;
        });
    </script>
```

