import google from 'googleapis';
import { stringify } from 'querystring';
import fetch from 'node-fetch';
const OAuth2 = google.auth.OAuth2;

function getAuthenticationUrl(scopes, clientId, clientSecret) {
  const oauth2Client = new OAuth2(
    clientId,
    clientSecret,
    'urn:ietf:wg:oauth:2.0:oob'
  );

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
    scope: scopes // If you only need one scope you can pass it as string
  });
  return url;
}


function authorizeApp(url, BrowserWindow) {
  return new Promise( (resolve, reject) => {
    const win = new BrowserWindow({
      'use-content-size': true
    });

    win.loadUrl(url);

    win.on('closed', () => {
      reject(new Error('User closed  the window'));
    });

    win.on('page-title-updated', () => {
      setImmediate(() => {
        const title = win.getTitle();
        if (title.startsWith('Denied')) {
          reject(new Error(title.split(/[ =]/)[2]));
          win.removeAllListeners('closed');
          win.close();
        } else if (title.startsWith('Success')) {
          resolve(title.split(/[ =]/)[2]);
          win.removeAllListeners('closed');
          win.close();
        }
      });
    });
  });
}

export default function electronGoogleOauth(BrowserWindow) {
  const exports = {
    getAuthorizationCode(scopes, clientId, clientSecret) {
      const url = getAuthenticationUrl(scopes, clientId, clientSecret);
      return authorizeApp(url, BrowserWindow);
    },

    async getAccessToken(scopes, clientId, clientSecret) {
      const authorizationCode = await exports.getAuthorizationCode(scopes, clientId, clientSecret);

      const data = stringify({
        code: authorizationCode,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: 'urn:ietf:wg:oauth:2.0:oob'
      });

      const res = await fetch('https://accounts.google.com/o/oauth2/token', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data
      });

      return await res.json();
    }

  };

  return exports;
}

