import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  MsalModule,
  MsalGuardConfiguration,
  MsalInterceptorConfiguration, MsalInterceptor,
} from '@azure/msal-angular';
import {HTTP_INTERCEPTORS, provideHttpClient} from '@angular/common/http';
import {BrowserCacheLocation, InteractionType, LogLevel, PublicClientApplication} from '@azure/msal-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const SERVER_ROOT = window.location.origin

const msalConfig = {
  auth: {
    clientId: "181e8307-909d-49e6-8ae2-7c357ed5a922",
    authority: "https://login.microsoftonline.com/common", // change to allow only CP emails?
    redirectUri: `${SERVER_ROOT}/app/auth-response`,
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
    storeAuthStateInCookie: true,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: LogLevel,
                       message: string,
                       containsPii: boolean
      ): void => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
      piiLoggingEnabled: false
    },
    windowHashTimeout: 60000,
    iframeHashTimeout: 6000,
    loadFrameTimeout: 0,
  }
}

const msalInstance = new PublicClientApplication(msalConfig);
export default msalInstance;

// MSAL Instance Factory
export function MSALInstanceFactory() {
  return new PublicClientApplication(msalConfig);
}

// MSAL Guard Configuration
export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect, // Or InteractionType.Popup
    authRequest: {
      scopes: ['user.read'], // Adjust scopes as needed
    }
  };
}

// MSAL Interceptor Configuration
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  return {
    interactionType: InteractionType.Redirect, // Or InteractionType.Popup
    protectedResourceMap: new Map([
      ['https://graph.microsoft.com/v1.0/me', ['user.read']],
    ]),
  };
}

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      MsalModule.forRoot(
        MSALInstanceFactory(),
        MSALGuardConfigFactory(),
        MSALInterceptorConfigFactory()
      )
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    }, provideAnimationsAsync()]
};
