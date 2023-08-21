# Changelog
All changes to this project will be documented in this file.

## [1.1.4] - 2023-08-21
- Include `mp4` in VideoUploadResponse type

## [1.1.3] - 2023-01-23
- Add onPlayable() method to define a listener called when the video is playable
  
## [1.1.2] - 2023-01-19
- Video upload: add maxVideoDuration option.

## [1.1.1] - 2023-01-17
- Progressive upload: add mergeSmallPartsBeforeUpload option.

## [1.1.0] - 2022-07-06
- Video upload & Progressive upload: allow user to set a customized video name.

## [1.0.11] - 2022-07-06
- Add origin headers

## [1.0.10] - 2022-06-29
- Retry even if the server is not responding.
- Add possibility to define a custom retry policy.

## [1.0.9] - 2022-05-24
- Progressive upload: prevent last part to be empty

## [1.0.8] - 2022-04-27
- Create a AbstractUploader
- Add origin header
- Add the possibility to provide a refresh token

## [1.0.7] - 2022-04-26
- Don't retry on 401 errors
- Mutualize some code
  
## [1.0.6] - 2022-04-22
- Improve errors management

## [1.0.5] - 2022-04-21
- Fix date attributes types
- Add authentication using an API key

## [1.0.4] - 2022-03-23
- Export `VideoUploadResponse` type

## [1.0.3] - 2022-01-25
- Fix typo in `VideoUploadResponse`type: `hsl` instead of `hls`
  
## [1.0.2] - 2021-11-24
- Fix: prevent concurrent requests
  
## [1.0.1] - 2021-11-23
- Add missing return types in upload methods
  
## [1.0.0] - 2021-11-16
- Bump dependancies
  
## [0.0.6] - 2021-11-10
- Add progressive upload feature

## [0.0.5] - 2021-08-12
- Fix chunk size (default 50MB, min 5MB, max 128MB)
- Fix upload progress listener
