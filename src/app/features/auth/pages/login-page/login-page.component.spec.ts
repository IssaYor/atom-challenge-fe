import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { LoginPageComponent } from './login-page.component';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { User } from '../../../../core/models/user.model';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  let authServiceMock: jasmine.SpyObj<AuthService>;
  let notificationMock: jasmine.SpyObj<NotificationService>;
  let dialogMock: jasmine.SpyObj<MatDialog>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj<AuthService>('AuthService', [
      'login',
      'register',
      'setSession',
      'logout',
    ]);

    notificationMock = jasmine.createSpyObj<NotificationService>(
      'NotificationService',
      ['success', 'error']
    );

    dialogMock = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

    routerMock = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [LoginPageComponent], // standalone
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: NotificationService, useValue: notificationMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login and setSession on success', () => {
    component.form.setValue({ email: 'test@mail.com' });

    authServiceMock.login.and.returnValue(
      of({
        exists: true,
        token: 'jwt-token',
        user: { email: 'test@mail.com' } as User,
      })
    );

    component.submit();

    expect(authServiceMock.login).toHaveBeenCalledWith('test@mail.com');
    expect(authServiceMock.setSession).toHaveBeenCalledWith(
      { email: 'test@mail.com' } as any,
      'jwt-token'
    );
    expect(notificationMock.success).toHaveBeenCalled();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/tasks');
  });

  it('should open dialog when user does not exist (404)', () => {
    component.form.setValue({ email: 'ghost@mail.com' });

    authServiceMock.login.and.returnValue(
      throwError(() => ({ status: 404 }))
    );

    // el diálogo devolverá "false" (usuario cancela)
    dialogMock.open.and.returnValue({
      afterClosed: () => of(false),
    } as any);

    component.submit();

    expect(dialogMock.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
      data: {
        title: 'Usuario no encontrado',
        message: jasmine.any(String),
        confirmText: 'Crear cuenta',
        cancelText: 'Cancelar',
      },
    });
  });

  it('should create user after confirm when not found', () => {
    component.form.setValue({ email: 'new@mail.com' });

    authServiceMock.login.and.returnValue(
      throwError(() => ({ status: 404 }))
    );

    // ahora el usuario confirma crear la cuenta
    dialogMock.open.and.returnValue({
      afterClosed: () => of(true),
    } as any);

    authServiceMock.register.and.returnValue(
      of({
        token: 'newtoken',
        user: { email: 'new@mail.com' } as any,
      })
    );

    component.submit();

    expect(authServiceMock.register).toHaveBeenCalledWith('new@mail.com');
    expect(authServiceMock.setSession).toHaveBeenCalledWith(
      { email: 'new@mail.com' } as any,
      'newtoken'
    );
    expect(notificationMock.success).toHaveBeenCalled();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/tasks');
  });

  it('should set errorMessage for unexpected errors', () => {
    component.form.setValue({ email: 'error@mail.com' });

    authServiceMock.login.and.returnValue(
      throwError(() => ({ status: 500 }))
    );

    component.submit();

    expect(component.errorMessage).toBe(
      'Error inesperado. Intenta nuevamente.'
    );
    // opcional: también podrías comprobar que NO abre el diálogo:
    expect(dialogMock.open).not.toHaveBeenCalled();
  });
});
