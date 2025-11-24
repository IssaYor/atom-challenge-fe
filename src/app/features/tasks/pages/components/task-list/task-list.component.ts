import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Task } from '../../../../../core/models/task.model';

@Component({
  standalone: true,
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  imports: [CommonModule, MatCheckboxModule, MatButtonModule, MatIconModule],
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];
  @Input() loading = false;

  @Input() pendingCount = 0;
  @Input() completedCount = 0;

  @Output() toggle = new EventEmitter<Task>();
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<Task>();

  onToggle(task: Task) {
    this.toggle.emit(task);
  }
  onEdit(task: Task) {
    this.edit.emit(task);
  }
  onDelete(task: Task) {
    this.delete.emit(task);
  }
}
