import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";

export type ToastType = "success" | "error" | "info";

export interface ToastData {
  message: string;
  type: ToastType;
}

@Component({
  selector: "app-toast",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast" *ngFor="let toast of toasts" [ngClass]="toast.type">
      <div class="toast__icon">
        <span class="material-icons">check_circle</span>
      </div>

      <div class="toast__content">
        <h4 class="toast__title">
          {{
            toast.type === "success"
              ? "Éxito"
              : toast.type === "error"
              ? "Error"
              : "Info"
          }}
        </h4>
        <p class="toast__message">
          {{ toast.message }}
        </p>
      </div>
    </div>
  `,
  styleUrls: ["./toast.component.scss"],
})
export class ToastComponent {
  toasts: ToastData[] = [];

  show(toast: ToastData) {
    this.toasts.push(toast);

    setTimeout(() => {
      this.toasts.shift();
    }, 3000);
  }
}
