// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  odataMetadataurl: "https://localhost:44377/OData/$metadata",
  baseUrl: "https://localhost:44377/",
  // apiUrl: 'https://localhost:44377/api',
  apiUrl: "https://www.amigolden.com/api/api",
  authentication: {
    userTokenName: "UT-8675309",
  },
  googleMaps: {
    // apiKey: "AIzaSyCXBaTUeO21FjzLJnghunS7CkDnLcLnYm4",
    // apiKey: "AIzaSyD7psaOzyFhNTJJaADO93nRc2xJnsdl_CY",
    apiKey: "AIzaSyAIgQez_AR0WN2_Kwx_SimJkOCtHQyzMdE",
  },
  data: {
    currentUser: "CurrentUser",
  },
  eventCosts: {
    platform: 2500,
    direct: 2000,
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
