// eslint-disable-next-line import/no-extraneous-dependencies
const {app} = require('electron');
const yargs = require('yargs');
const ego = require('./index');

const auth = ego();
const argv = yargs.argv;
const preventQuit = e => e.preventDefault();

app.on('will-quit', preventQuit);

app.on('ready', () => {
	auth.getAccessToken(
		argv.scopes,
		argv.clientId,
		argv.clientSecret,
		argv.redirectUri
	)
	.then(token => {
		process.stdout.write(JSON.stringify(token, null, 2));
		app.removeListener('will-quit', preventQuit);
		app.quit();
	})
	.catch(err => {
		process.stderr.write(err.message + '\n');
	});
});
