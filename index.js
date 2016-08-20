const {stringify} = require('querystring');
const google = require('googleapis');
const fetch = require('node-fetch');
// eslint-disable-next-line import/no-extraneous-dependencies
const BrowserWindow = require('browser-window');

const OAuth2 = google.auth.OAuth2;

/* eslint-disable camelcase */

function getAuthenticationUrl(scopes, clientId, clientSecret, redirectUri = 'urn:ietf:wg:oauth:2.0:oob') {
	const oauth2Client = new OAuth2(
		clientId,
		clientSecret,
		redirectUri
	);
	const url = oauth2Client.generateAuthUrl({
		access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
		scope: scopes // If you only need one scope you can pass it as string
	});
	return url;
}

function authorizeApp(url, __unused_BrowserWindow, browserWindowParams) {
	return new Promise((resolve, reject) => {
		const win = new BrowserWindow(browserWindowParams || {'use-content-size': true});

		win.loadURL(url);

		win.on('closed', () => {
			reject(new Error('User closed	the window'));
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

export default function electronGoogleOauth(__unused_BrowserWindow, browserWindowParams, httpAgent) {
	// to keep compatibility, if browserwindow arg is supplied
	// we ignore it
	if (__unused_BrowserWindow && browserWindowParams) {
		browserWindowParams = __unused_BrowserWindow;
	}

	const exports = {
		getAuthorizationCode(scopes, clientId, clientSecret, redirectUri = 'urn:ietf:wg:oauth:2.0:oob') {
			const url = getAuthenticationUrl(scopes, clientId, clientSecret, redirectUri);
			return authorizeApp(url, BrowserWindow, browserWindowParams);
		},

		async getAccessToken(scopes, clientId, clientSecret, redirectUri = 'urn:ietf:wg:oauth:2.0:oob') {
			const authorizationCode = await exports.getAuthorizationCode(scopes, clientId, clientSecret, redirectUri);

			const data = stringify({
				code: authorizationCode,
				client_id: clientId,
				client_secret: clientSecret,
				grant_type: 'authorization_code',
				redirect_uri: redirectUri
			});

			const res = await fetch('https://accounts.google.com/o/oauth2/token', {
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: data,
				agent: httpAgent
			});
			return await res.json();
		}
	};

	return exports;
}
