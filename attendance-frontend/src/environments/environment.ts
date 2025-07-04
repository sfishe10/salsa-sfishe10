const SERVER_ROOT = window.location.origin

export const environment = {
  production: false,

  serviceURL: "http://localhost:3001/api",
  config: {
    auth: {
      "clientId": "181e8307-909d-49e6-8ae2-7c357ed5a922",
      "authority": "https://login.microsoftonline.com/common/v2.0",
      "validateAuthority": true,
      "redirectUri": `${SERVER_ROOT}/app/auth-response`,
      "postLogoutRedirectUri": "http://localhost:4200",
      "navigateToLoginRequestUrl": true
    },
    cache: {
      "cacheLocation": "localStorage"
    },
    resources: {
      "demoApi": {
        "resourceUri": "http://localhost:3001/api",
        "resourceScope": "api://181e8307-909d-49e6-8ae2-7c357ed5a922/access_as_user",
      }
    },
    scopes: {
      "loginRequest": [
        "openid",
        "profile"
      ]
    }
  }
};
