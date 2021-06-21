![](https://github.com/apivideo/API_OAS_file/blob/master/apivideo_banner.png)

# api.video video uploader

Typescript library to upload videos to api.video using delegated token

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
