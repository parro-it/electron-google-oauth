#!/usr/bin/env electron

import ego from './index';
import BrowserWindow from 'browser-window';
import app from 'app';
import yargs from 'yargs';

const auth = ego(BrowserWindow);
const argv = yargs.argv;

const preventQuit = e => e.preventDefault();

app.on('will-quit', preventQuit);

app.on('ready', async () => {
  try {
    const token = await auth.getAccessToken(
      argv.scopes,
      argv.clientId,
      argv.clientSecret
    );
    process.stdout.write(JSON.stringify(token, null, 2));
  } catch(err) {
    process.stderr.write(err.message + '\n');
  }

  app.removeListener('will-quit', preventQuit);
  app.quit();
});
