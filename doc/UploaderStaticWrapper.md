# Uploader static wrapper documentation

## Overview

The `UploaderStaticWrapper` class serves as a static interface to the underlying object-oriented uploader library. 

This static abstraction is particularly beneficial in contexts where direct object manipulation can be challenging, such as when working within cross-platform frameworks like Flutter or React Native, or in no-code solutions. 

By providing a suite of static methods, `UploaderStaticWrapper` allows developers to leverage the power of the library without the complexity of handling instances or managing object lifecycles. 

This approach simplifies integration, making it more accessible for a wider range of development environments where traditional object-oriented paradigms are less suitable or harder to implement.

## Common functions

### `UploaderStaticWrapper.setApplicationName(name: string, version: string)`

Sets the application name and version for the SDK.

- **Parameters:**
  - `name: string` - The name of the application using the SDK.
  - `version: string` - The version of the application.

### `UploaderStaticWrapper.setChunkSize(chunkSize: number)`

Sets the chunk size for the video upload.

- **Parameters:**
  - `chunkSize: number` - The size of each chunk in bytes.


### `UploaderStaticWrapper.cancelAll()`

Cancels all ongoing uploads, both progressive and standard.


## Standard uploads functions


### `UploaderStaticWrapper.uploadWithUploadToken(blob: Blob, uploadToken: string, videoName: string, onProgress: (event: number) => void, videoId?: string)`

Uploads a video with an upload token.

- **Parameters:**
  - `blob: Blob` - The video file to be uploaded.
  - `uploadToken: string` - The upload token provided by the backend.
  - `videoName: string` - The name of the video.
  - `onProgress: (event: number) => void` - The callback to call on progress updates.
  - `videoId?: string` - The ID of the video to be uploaded (optional).

- **Returns:**
  - `Promise<string>` - A promise resolving to a JSON representation of the `VideoUploadResponse` object.

### `UploaderStaticWrapper.uploadWithApiKey(blob: Blob, apiKey: string, onProgress: (event: number) => void, videoId: string)`

Uploads a video with an API key.

- **Parameters:**
  - `blob: Blob` - The video file to be uploaded.
  - `apiKey: string` - The API key provided by the backend.
  - `onProgress: (event: number) => void` - The callback to call on progress updates.
  - `videoId: string` - The ID of the video to be uploaded (optional).

- **Returns:**
  - `Promise<string>` - A promise resolving to a JSON representation of the `VideoUploadResponse` object.

## Progressive uploads functions

### `UploaderStaticWrapper.createProgressiveUploadWithUploadTokenSession(sessionId: string, uploadToken: string, videoId: string)`

Creates a new progressive upload session with an upload token.

- **Parameters:**
  - `sessionId: string` - The unique session identifier.
  - `uploadToken: string` - The upload token provided by the backend.
  - `videoId: string` - The ID of the video to be uploaded.

### `UploaderStaticWrapper.createProgressiveUploadWithApiKeySession(sessionId: string, apiKey: string, videoId: string)`

Creates a new progressive upload session with an API key.

- **Parameters:**
  - `sessionId: string` - The unique session identifier.
  - `apiKey: string` - The API key provided by the backend.
  - `videoId: string` - The ID of the video to be uploaded.

### `UploaderStaticWrapper.uploadPart(sessionId: string, blob: Blob, onProgress: (progress: number) => void)`

Uploads a part of a video in a progressive upload session.

- **Parameters:**
  - `sessionId: string` - The unique session identifier.
  - `blob: Blob` - The video part.
  - `onProgress: (progress: number) => void` - The callback to call on progress updates.

- **Returns:**
  - `Promise<string>` - A promise resolving to a JSON representation of the `VideoUploadResponse` object.
- 
### `UploaderStaticWrapper.uploadLastPart(sessionId: string, blob: Blob, onProgress: (progress: number) => void)`

Uploads the last part of a video in a progressive upload session and finalizes the upload.

- **Parameters:**
  - `sessionId: string` - The unique session identifier.
  - `blob: Blob` - The video part.
  - `onProgress: (progress: number) => void` - The callback to call on progress updates.

- **Returns:**
  - `Promise<string>` - A promise resolving to a JSON representation of the `VideoUploadResponse` object.

### `UploaderStaticWrapper.disposeProgressiveUploadSession(sessionId: string)`

Disposes a progressive upload session by its ID.

- **Parameters:**
  - `sessionId: string` - The unique session identifier to dispose.
