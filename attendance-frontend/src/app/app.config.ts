import {APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  MsalModule,
  MsalGuardConfiguration,
  MsalInterceptorConfiguration, MsalInterceptor, MsalGuard,
} from '@azure/msal-angular';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {
  Configuration,
  InteractionType,
  LogLevel,
  PublicClientApplication
} from '@azure/msal-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideNativeDateAdapter} from '@angular/material/core';
import {environment} from '../environments/environment';

const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

export const msalConfig: Configuration = {
  auth: {
    clientId: environment.config.auth.clientId,
    authority: environment.config.auth.authority,
    redirectUri: environment.config.auth.redirectUri,
    postLogoutRedirectUri: environment.config.auth.postLogoutRedirectUri,
    navigateToLoginRequestUrl: true
  },
  cache: {
    //cacheLocation: environment.config.cache.cacheLocation,
    //storeAuthStateInCookie: isIE
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true
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
      piiLoggingEnabled: true
    },
    windowHashTimeout: 60000,
    iframeHashTimeout: 6000,
    loadFrameTimeout: 0
  }
}

export const protectedResources = {
  demoApi: {
    endpoint: environment.config.resources.demoApi.resourceUri,
    scopes: [environment.config.resources.demoApi.resourceScope],
  },
}
export const loginRequest = {
  scopes: [
    ...environment.config.scopes.loginRequest
  ]
};

// MSAL Instance Factory
export function MSALInstanceFactory() {
  return new PublicClientApplication(msalConfig);
}

// MSAL Guard Configuration
export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: [
        ...protectedResources.demoApi.scopes,
        ...loginRequest.scopes,
      ]
    }
  };
}

// MSAL Interceptor Configuration
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap: new Map([
      [protectedResources.demoApi.endpoint, protectedResources.demoApi.scopes],
    ]),
  };
}

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
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
    },
    MsalGuard,
    provideAnimationsAsync(),
    provideNativeDateAdapter()]
};
