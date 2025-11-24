import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { Router } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";

import { Task } from "../../../../core/models/task.model";
import {
  CreateTaskRequest,
  TaskService,
} from "../../../../core/services/task/task.service";
import { AuthService } from "../../../../core/services/auth/auth.service";
import { NotificationService } from "../../../../shared/services/notification.service";
import { TaskFormComponent } from "../components/task-form/task-form.component";
import { TaskListComponent } from "../components/task-list/task-list.component";

@Component({
  standalone: true,
  selector: "app-task-list-page",
  templateUrl: "./task-list-page.component.html",
  styleUrls: ["./task-list-page.component.scss"],
  imports: [
    CommonModule,
    MatButtonModule,
    TaskFormComponent,
    TaskListComponent,
  ],
})
export class TaskListPageComponent implements OnInit {
  private taskService = inject(TaskService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private notifications = inject(NotificationService);

  tasks: Task[] = [];
  loading = false;
  saving = false;
  editingTask: Task | null = null;
  errorMessage: string | null = null;

  resetCounter = 0;

  ngOnInit(): void {
    this.loadTasks();
  }

  get pendingCount(): number {
    return this.tasks.filter((t) => !t.completed).length;
  }

  get completedCount(): number {
    return this.tasks.filter((t) => t.completed).length;
  }

  loadTasks(): void {
    this.loading = true;

    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notifications.error(
          "Ocurrió un error al cargar tus tareas. Inténtalo de nuevo más tarde."
        );
      },
    });
  }

  onSubmitTask(payload: CreateTaskRequest): void {
    this.saving = true;
    this.errorMessage = null;

    if (this.editingTask) {
      this.taskService.updateTask(this.editingTask.id, payload).subscribe({
        next: (updated) => {
          this.tasks = this.tasks.map((t) =>
            t.id === updated.id ? updated : t
          );
          this.editingTask = null;
          this.saving = false;
          this.notifications.success("Tarea actualizada correctamente");
          this.resetCounter++;
        },
        error: (err) => {
          const msg =
            err?.error?.message ??
            "No se pudo actualizar la tarea. Inténtalo de nuevo.";
          this.errorMessage = msg;
          this.notifications.error(msg);
          this.saving = false;
        },
      });
    } else {
      this.taskService.createTask(payload).subscribe({
        next: (created) => {
          this.tasks = [created, ...this.tasks];
          this.saving = false;
          this.notifications.success("Tarea creada correctamente");
          this.resetCounter++;
        },
        error: (err) => {
          const msg =
            err?.error?.message ??
            "No se pudo crear la tarea. Inténtalo de nuevo.";
          this.errorMessage = msg;
          this.notifications.error(msg);
          this.saving = false;
        },
      });
    }
  }

  onCancelEdit(): void {
    this.editingTask = null;
    this.errorMessage = null;
  }


  onToggleCompleted(task: Task): void {
    this.taskService.toggleCompleted(task).subscribe({
      next: (updated) => {
        this.tasks = this.tasks.map((t) => (t.id === updated.id ? updated : t));
      },
      error: () => {
        this.notifications.error(
          "No se pudo actualizar el estado de la tarea."
        );
      },
    });
  }

  onEdit(task: Task): void {
    this.editingTask = task;
  }

  onDelete(task: Task): void {
    if (this.saving) return;

    this.saving = true;

    this.taskService.deleteTask(task.id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter((t) => t.id !== task.id);
        this.saving = false;
        this.notifications.success("Tarea eliminada correctamente");
      },
      error: (err) => {
        console.error(err);
        this.saving = false;
        this.notifications.error(
          err?.error?.message ??
            "No se pudo eliminar la tarea. Inténtalo de nuevo."
        );
      },
    });
  }

  backToLogin(): void {
    this.authService.logout();
    this.router.navigateByUrl("/login");
  }

  onFormSubmitted() {
    this.editingTask = null;
  }
  
}
