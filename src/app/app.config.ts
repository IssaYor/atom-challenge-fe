import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { authTokenInterceptor } from './core/interceptors/auth-token.interceptor';
import { API_URL } from "./environments/api-url.token";
import { environment } from "./environments/environment";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { MatSnackBarModule } from "@angular/material/snack-bar";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    {provide : API_URL, useValue: environment.apiBaseUrl },
    provideHttpClient(withInterceptors([authTokenInterceptor])),
    importProvidersFrom(MatSnackBarModule)
  ],
};
