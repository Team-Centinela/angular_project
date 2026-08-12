import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { safeReturnUrl } from '../utils/safe-return-url';

const NO_REDIRECT_ON_401: readonly string[] = ['/login', '/register'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getToken();
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !NO_REDIRECT_ON_401.includes(router.url)) {
        auth.clearSession();
        router.navigate(['/login'], {
          queryParams: { returnUrl: safeReturnUrl(router.url) },
        });
      }
      return throwError(() => err);
    }),
  );
};
