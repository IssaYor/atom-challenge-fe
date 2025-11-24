import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dialog-container">
      <h2 class="dialog-title">{{ data.title }}</h2>
      <p class="dialog-message" [innerHTML]="data.message"></p>

      <div class="dialog-actions">
        <button class="btn-cancel" (click)="close(false)">
          {{ data.cancelText || 'Cancelar' }}
        </button>

        <button class="btn-confirm" (click)="close(true)">
          {{ data.confirmText || 'Aceptar' }}
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
    private dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) {}

  close(value: boolean) {
    this.dialogRef.close(value);
  }
}
