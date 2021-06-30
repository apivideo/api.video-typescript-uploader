![](https://github.com/apivideo/API_OAS_file/blob/master/apivideo_banner.png)

# api.video video uploader

Typescript library to upload videos to api.video using delegated token (or usual access token) from front-end.

# Usage

## Installation method #1: requirejs

If you use requirejs you can add the library as a dependency to your project with 

```sh
$ npm install --save @api.video/video-uploader
```

You can then use the library in your script: 

```javascript
var { VideoUploader } = require('@api.video/video-uploader');

var uploader = new VideoUploader("#target", {
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

const uploader = new VideoUploader("#target", {
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

The upload is instanciated using an `options` object. Options to provide depend on the way you want to authenticate to the API: either using a delegated upload token (recommanded), or using a usual access token. 

### Using a delegated token:


|                   Option name | Mandatory | Type   | Description       |
| ----------------------------: | --------- | ------ | ----------------- |
|                   uploadToken | **yes**   | string | your upload token |
| _common options (see bellow)_ |           |        |                   |


### Using an access token:


|                   Option name | Mandatory | Type   | Description             |
| ----------------------------: | --------- | ------ | ----------------------- |
|                   accessToken | **yes**   | string | your access token       |
|                       videoId | **yes**   | string | id of an existing video |
| _common options (see bellow)_ |           |        |                         |


### Common options


| Option name | Mandatory | Type   | Description                                           |
| ----------: | --------- | ------ | ----------------------------------------------------- |
|        file | yes       | File   | the file you want to upload                           |
|   chunkSize | no        | number | number of bytes of each upload chunk (default: 1MB)   |
|     apiHost | no        | string | api.video host (default: ws.api.video)                |
|     retries | no        | number | number of retries when an API call fails (default: 5) |


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
An onProgress event contains 2 attributes:
- loaded: the number of uploaded bytes
- total: the total number of bytes

### Example

```javascript
    // ... uploader instanciation
    
    uploader.onProgress((event) => console.log(event.loaded, event.total));
```