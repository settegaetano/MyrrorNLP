// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  appName: 'Myrror',
  api: 'http://localhost:5000/',
  socket: 'http://localhost:5000/',
  twitterCallbackUrl: 'http://localhost:4200/identities/twitter',
  facebookCallbackUrl: 'http://localhost:4200/identities/facebook',
  linkedinCallbackUrl: 'http://localhost:4200/identities/linkedin',
  fitbitCallbackUrl: 'http://localhost:4200/identities/fitbit',
  instagramCallbackUrl: 'http://localhost:4200/identities/instagram',
  telegramCallbackUrl: 'http://localhost:4200/identities/telegram',

};
