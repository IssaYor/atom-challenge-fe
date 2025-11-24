import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { API_URL } from '../../../environments/api-url.token';
import { User } from '../../models/user.model';


describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockApiUrl = 'https://test-api.example.com';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: API_URL, useValue: mockApiUrl },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should call /api/auth/login with email and return response', () => {
    const email = 'test@example.com';

    const mockResponse = {
      exists: true,
      user: {
        id: 'test@example.com',
        email,
        createdAt: new Date().toISOString(),
      } as User,
      token: 'jwt-token',
    };

    service.login(email).subscribe((resp) => {
      expect(resp.exists).toBeTrue();
      expect(resp.user?.email).toBe(email);
      expect(resp.token).toBe('jwt-token');
    });

    const req = httpMock.expectOne(`${mockApiUrl}/api/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email });

    req.flush(mockResponse);
  });

  it('should call /api/auth/register with email and return response', () => {
    const email = 'newuser@example.com';

    const mockResponse = {
      user: {
        id: email,
        email,
        createdAt: new Date().toISOString(),
      } as unknown as User,
      token: 'jwt-token-register',
    };

    service.register(email).subscribe((resp) => {
      expect(resp.user.email).toBe(email);
      expect(resp.token).toBe('jwt-token-register');
    });

    const req = httpMock.expectOne(`${mockApiUrl}/api/auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email });

    req.flush(mockResponse);
  });

  it('should store user and token in localStorage when setSession is called', () => {
    const user: User = {
      id: 'user@test.com',
      email: 'user@test.com',
      createdAt: new Date().toDateString(),
    };

    const token = 'jwt-token-123';

    service.setSession(user, token);

    expect(localStorage.getItem('auth_token')).toBe(token);
    const storedUser = localStorage.getItem('auth_user');
    expect(storedUser).not.toBeNull();
    expect(JSON.parse(storedUser!).email).toBe(user.email);
  });

  it('should clear localStorage on logout', () => {
    localStorage.setItem('auth_token', 'token');
    localStorage.setItem('auth_user', JSON.stringify({ email: 'a@a.com' }));

    service.logout();

    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('auth_user')).toBeNull();
  });
});
