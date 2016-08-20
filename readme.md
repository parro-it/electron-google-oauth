# electron-google-oauth

Get Google api access token using an electron window
to let the user authorize the app.

[![Travis Build Status](https://img.shields.io/travis/parro-it/electron-google-oauth/master.svg)](http://travis-ci.org/parro-it/electron-google-oauth)

## Installation

```bash
npm install --save electron-google-oauth
```

## Usage

```javascript
  import electronGoogleOauth from 'electron-google-oauth';

  const browserWindowParams = {
      'use-content-size': true,
      center: true,
      show: false,
      resizable: false,
      'always-on-top': true,
      'standard-window': true,
      'auto-hide-menu-bar': true,
      'node-integration': false
  };

  const googleOauth = electronGoogleOauth(browserWindowParams);

  ( async () => {

    // retrieve  authorization code only
    const authCode = await googleOauth.getAuthorizationCode(
      ['https://www.google.com/m8/feeds'],
      'your-client-id',
      'your-client-secret',
      'your-redirect-uri'
    );
    console.dir(authCode);

    // retrieve access token and refresh token
    const result = await googleOauth.getAccessToken(
      ['https://www.google.com/m8/feeds'],
      'your-client-id',
      'your-client-secret',
      'your-redirect-uri'
    );
    console.dir(result);

  })();

```

## Testing

To test the library, clone this git repo, then define CLIENTSECRET and CLIENTID environment variables holding your Google API details, then run:


```bash
npm install
npm start
```

## License

The MIT License (MIT)

Copyright (c) 2015 Andrea Parodi
