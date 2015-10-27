# electron-google-oauth

Get Google api access token using an electron window
to let the user authorize the app.

## Installation

```bash
npm install --save electron-google-oauth
```

## Usage

```javascript
  import electronGoogleOauth from 'electron-google-oauth';
  import BrowserWindow from 'browser-window';

  // require BrowserWindow class all argument
  // to avoid strict coupling with electron
  
  const BrowserWindowParams = {
            'use-content-size': true,
            center: true,
            show: false,
            resizable: false,
            'always-on-top': true,
            'standard-window': true,
            'auto-hide-menu-bar': true,
            'node-integration': false
        };
  
  const googleOauth = electronGoogleOauth(BrowserWindow, BrowserWindowParams);

  ( async () => {

    // retrieve  authorization code only
    const authCode = await googleOauth.getAuthorizationCode(
      ['https://www.google.com/m8/feeds'],
      'your-client-id',
      'your-client-secret'
    );
    console.dir(authCode);

    // retrieve access token and refresh token
    const result = await googleOauth.getAccessToken(
      ['https://www.google.com/m8/feeds'],
      'your-client-id',
      'your-client-secret'
    );
    console.dir(result);

  })();

```

## License
The MIT License (MIT)

Copyright (c) 2015 Andrea Parodi



