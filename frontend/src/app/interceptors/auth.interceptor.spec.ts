import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'authUser';

describe('authInterceptor (regression for #87, #92, #96)', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authService: AuthService;
  let router: Router;

  const setToken = (token: string | null) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  };

  const callApi = () => http.get('/api/products').subscribe();
  const flushWith = (status: number, statusText: string) =>
    httpMock.expectOne('/api/products').flush(statusText, {
      status,
      statusText,
    });

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('Authorization header', () => {
    it('attaches Bearer token when one is present', () => {
      setToken('jwt-abc');
      callApi();
      const req = httpMock.expectOne('/api/products');
      expect(req.request.headers.get('Authorization')).toBe('Bearer jwt-abc');
      req.flush([]);
    });

    it('does NOT attach Authorization when no token', () => {
      setToken(null);
      callApi();
      const req = httpMock.expectOne('/api/products');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush([]);
    });
  });

  describe('401 handling', () => {
    beforeEach(() => setToken('jwt-abc'));

    it('on 401 from a non-auth route: clears session and navigates to /login with returnUrl', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      Object.defineProperty(router, 'url', {
        configurable: true,
        get: () => '/products?categoryId=foo',
      });

      callApi();
      flushWith(401, 'Unauthorized');

      expect(authService.getToken()).toBeNull();
      expect(navigateSpy).toHaveBeenCalledWith(['/login'], {
        queryParams: { returnUrl: '/products?categoryId=foo' },
      });
    });

    it('on 401 from /login (loop fix, #87/#92): does NOT clear session and does NOT navigate', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      const clearSpy = jest.spyOn(authService, 'clearSession');
      Object.defineProperty(router, 'url', {
        configurable: true,
        get: () => '/login',
      });

      callApi();
      flushWith(401, 'Unauthorized');

      expect(navigateSpy).not.toHaveBeenCalled();
      expect(clearSpy).not.toHaveBeenCalled();
      expect(authService.getToken()).toBe('jwt-abc');
    });

    it('on 401 from /login?returnUrl=... (startsWith fix, #92): does NOT navigate', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      Object.defineProperty(router, 'url', {
        configurable: true,
        get: () => '/login?returnUrl=/products',
      });

      callApi();
      flushWith(401, 'Unauthorized');

      expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('on 401 from /register: does NOT clear session and does NOT navigate', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      const clearSpy = jest.spyOn(authService, 'clearSession');
      Object.defineProperty(router, 'url', {
        configurable: true,
        get: () => '/register',
      });

      callApi();
      flushWith(401, 'Unauthorized');

      expect(navigateSpy).not.toHaveBeenCalled();
      expect(clearSpy).not.toHaveBeenCalled();
      expect(authService.getToken()).toBe('jwt-abc');
    });
  });

  describe('Non-401 handling', () => {
    it('on 500 from a non-auth route: re-throws, no navigation, no clearSession', () => {
      setToken('jwt-abc');
      const navigateSpy = jest.spyOn(router, 'navigate');
      Object.defineProperty(router, 'url', {
        configurable: true,
        get: () => '/products',
      });
      const clearSpy = jest.spyOn(authService, 'clearSession');

      callApi();
      flushWith(500, 'Server Error');

      expect(navigateSpy).not.toHaveBeenCalled();
      expect(clearSpy).not.toHaveBeenCalled();
    });
  });
});
