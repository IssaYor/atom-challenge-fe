import { Injectable, ApplicationRef, ComponentRef, createComponent } from '@angular/core';
import { ToastComponent, ToastType } from '../../shared/components/toast/toast.component';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private componentRef?: ComponentRef<ToastComponent>;

  constructor(private appRef: ApplicationRef) {}

  private ensureContainer() {
    if (!this.componentRef) {
      this.componentRef = createComponent(ToastComponent, {
        environmentInjector: this.appRef.injector,
      });

      this.appRef.attachView(this.componentRef.hostView);
      document.body.appendChild(this.componentRef.location.nativeElement);
    }
  }

  show(message: string, type: ToastType = 'success') {
    this.ensureContainer();
    this.componentRef!.instance.show({ message, type });
  }

  success(msg: string) {
    this.show(msg, 'success');
  }

  error(msg: string) {
    this.show(msg, 'error');
  }

  info(msg: string) {
    this.show(msg, 'info');
  }
}
