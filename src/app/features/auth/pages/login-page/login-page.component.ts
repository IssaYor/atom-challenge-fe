import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../../core/services/auth/auth.service";
import { MatDialog } from "@angular/material/dialog";
import {
  ConfirmDialogComponent,
} from "../../../../shared/components/confirm-dialog/confirm-dialog.component";
import { NotificationService } from "../../../../shared/services/notification.service";

@Component({
  standalone: true,
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"],
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private notifications = inject(NotificationService);

  loading = false;
  errorMessage: string | null = null;

  form = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
  });

  get email() {
    return this.form.controls.email;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  
    this.loading = true;
    this.errorMessage = null;
  
    const email = this.form.value.email!;
  
    this.authService.login(email).subscribe({
      next: (resp) => {
        if (resp.token && resp.user) {
          this.notifications.success(`Bienvenido de nuevo, ${resp.user.email}!`);
          this.authService.setSession(resp.user, resp.token);
          this.loading = false;
          this.router.navigateByUrl('/tasks');
        }
      },
      error: (err) => {
        this.loading = false;
  
        if (err.status === 404) {
          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
              title: 'Usuario no encontrado',
              message: `No existe una cuenta con el email <b>${email}</b>. ¿Deseas crearla?`,
              confirmText: 'Crear cuenta',
              cancelText: 'Cancelar'
            }
          });
  
          dialogRef.afterClosed().subscribe((confirm) => {
            if (confirm) {
              this.createUser(email);
            }
          });
  
          return;
        }
  
        this.errorMessage = 'Error inesperado. Intenta nuevamente.';
      },
    });
  }
  

  private createUser(email: string) {
    this.loading = true;
  
    this.authService.register(email).subscribe({
      next: (resp) => {
        if (resp.token && resp.user) {
          this.notifications.success(`Cuenta creada exitosamente. Bienvenido, ${resp.user.email}!`);
          this.authService.setSession(resp.user, resp.token);
          this.router.navigateByUrl('/tasks');
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se pudo crear la cuenta.';
        this.notifications.error(this.errorMessage);
      },
    });
  }
  
}
