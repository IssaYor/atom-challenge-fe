import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { TaskListPageComponent } from './task-list-page.component';
import { TaskService, CreateTaskRequest } from '../../../../core/services/task/task.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { Task } from '../../../../core/models/task.model';

describe('TaskListPageComponent', () => {
  let component: TaskListPageComponent;
  let fixture: ComponentFixture<TaskListPageComponent>;

  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const buildTask = (id: string, completed = false): Task => ({
    id,
    userId: 'user@test.com',
    title: `Task ${id}`,
    description: `Desc ${id}`,
    completed,
    createdAt: new Date().toDateString(),
  });

  beforeEach(async () => {
    taskServiceSpy = jasmine.createSpyObj('TaskService', [
      'getTasks',
      'createTask',
      'updateTask',
      'toggleCompleted',
      'deleteTask',
    ]);

    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    notificationSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [TaskListPageComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListPageComponent);
    component = fixture.componentInstance;
  });

  // ---------- ngOnInit / loadTasks ----------

  it('should load tasks on init (success)', () => {
    const tasks = [buildTask('1'), buildTask('2', true)];
    taskServiceSpy.getTasks.and.returnValue(of(tasks));

    fixture.detectChanges(); // dispara ngOnInit

    expect(taskServiceSpy.getTasks).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
    expect(component.tasks).toEqual(tasks);
  });

  it('should show error notification when loadTasks fails', () => {
    taskServiceSpy.getTasks.and.returnValue(
      throwError(() => new Error('load error')),
    );

    fixture.detectChanges(); // dispara ngOnInit

    expect(taskServiceSpy.getTasks).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
    expect(notificationSpy.error).toHaveBeenCalledWith(
      'Ocurrió un error al cargar tus tareas. Inténtalo de nuevo más tarde.',
    );
  });

  // ---------- onSubmitTask (create) ----------

  it('should create a new task when not editing', () => {
    const existing = [buildTask('1')];
    component.tasks = [...existing];
    component.editingTask = null;

    const payload: CreateTaskRequest = {
      title: 'Nueva tarea',
      description: 'Desc',
    };

    const created = buildTask('2');
    taskServiceSpy.createTask.and.returnValue(of(created));

    component.onSubmitTask(payload);

    expect(taskServiceSpy.createTask).toHaveBeenCalledWith(payload);
    // creada primero en la lista
    expect(component.tasks[0]).toEqual(created);
    expect(component.tasks.length).toBe(2);
    expect(component.saving).toBeFalse();
    expect(notificationSpy.success).toHaveBeenCalledWith(
      'Tarea creada correctamente',
    );
  });

  it('should handle error when createTask fails', () => {
    component.editingTask = null;

    const payload: CreateTaskRequest = {
      title: 'Nueva tarea',
      description: 'Desc',
    };

    taskServiceSpy.createTask.and.returnValue(
      throwError(() => ({ error: { message: 'Error al crear' } })),
    );

    component.onSubmitTask(payload);

    expect(taskServiceSpy.createTask).toHaveBeenCalledWith(payload);
    expect(component.saving).toBeFalse();
    expect(component.errorMessage).toBe('Error al crear');
    expect(notificationSpy.error).toHaveBeenCalledWith('Error al crear');
  });

  // ---------- onSubmitTask (update) ----------

  it('should update task when editingTask is set', () => {
    const original = buildTask('1', false);
    const other = buildTask('2', false);
    component.tasks = [original, other];
    component.editingTask = original;

    const payload: CreateTaskRequest = {
      title: 'Tarea actualizada',
      description: 'Nueva desc',
    };

    const updated: Task = {
      ...original,
      title: payload.title,
      description: payload.description!,
    };

    taskServiceSpy.updateTask.and.returnValue(of(updated));

    component.onSubmitTask(payload);

    expect(taskServiceSpy.updateTask).toHaveBeenCalledWith(original.id, payload);
    expect(component.tasks.find((t) => t.id === original.id)).toEqual(updated);
    expect(component.editingTask).toBeNull();
    expect(component.saving).toBeFalse();
    expect(notificationSpy.success).toHaveBeenCalledWith(
      'Tarea actualizada correctamente',
    );
  });

  it('should handle error when updateTask fails', () => {
    const original = buildTask('1', false);
    component.tasks = [original];
    component.editingTask = original;

    const payload: CreateTaskRequest = {
      title: 'Tarea actualizada',
      description: 'Nueva desc',
    };

    taskServiceSpy.updateTask.and.returnValue(
      throwError(() => ({ error: { message: 'Error al actualizar' } })),
    );

    component.onSubmitTask(payload);

    expect(taskServiceSpy.updateTask).toHaveBeenCalledWith(original.id, payload);
    expect(component.saving).toBeFalse();
    expect(component.errorMessage).toBe('Error al actualizar');
    expect(notificationSpy.error).toHaveBeenCalledWith('Error al actualizar');
  });

  // ---------- onToggleCompleted ----------

  it('should toggle completed state of a task', () => {
    const task = buildTask('1', false);
    component.tasks = [task];

    const updated = { ...task, completed: true };
    taskServiceSpy.toggleCompleted.and.returnValue(of(updated));

    component.onToggleCompleted(task);

    expect(taskServiceSpy.toggleCompleted).toHaveBeenCalledWith(task);
    expect(component.tasks[0].completed).toBeTrue();
  });

  it('should show error notification when toggleCompleted fails', () => {
    const task = buildTask('1', false);
    component.tasks = [task];

    taskServiceSpy.toggleCompleted.and.returnValue(
      throwError(() => new Error('toggle error')),
    );

    component.onToggleCompleted(task);

    expect(taskServiceSpy.toggleCompleted).toHaveBeenCalledWith(task);
    expect(notificationSpy.error).toHaveBeenCalledWith(
      'No se pudo actualizar el estado de la tarea.',
    );
  });

  // ---------- onEdit / onCancelEdit / onFormSubmitted ----------

  it('should set editingTask when onEdit is called', () => {
    const task = buildTask('1');
    component.onEdit(task);
    expect(component.editingTask).toEqual(task);
  });

  it('should clear editingTask and errorMessage onCancelEdit', () => {
    component.editingTask = buildTask('1');
    component.errorMessage = 'error';
    component.onCancelEdit();

    expect(component.editingTask).toBeNull();
    expect(component.errorMessage).toBeNull();
  });

  it('should clear editingTask onFormSubmitted', () => {
    component.editingTask = buildTask('1');
    component.onFormSubmitted();
    expect(component.editingTask).toBeNull();
  });

  // ---------- onDelete ----------

  it('should delete a task when onDelete succeeds', () => {
    const task1 = buildTask('1');
    const task2 = buildTask('2');
    component.tasks = [task1, task2];

    taskServiceSpy.deleteTask.and.returnValue(of(void 0));

    component.onDelete(task1);

    expect(taskServiceSpy.deleteTask).toHaveBeenCalledWith(task1.id);
    expect(component.tasks.length).toBe(1);
    expect(component.tasks[0]).toEqual(task2);
    expect(component.saving).toBeFalse();
    expect(notificationSpy.success).toHaveBeenCalledWith(
      'Tarea eliminada correctamente',
    );
  });

  it('should show error notification when onDelete fails', () => {
    const task = buildTask('1');
    component.tasks = [task];

    taskServiceSpy.deleteTask.and.returnValue(
      throwError(() => ({ error: { message: 'Error al eliminar' } })),
    );

    component.onDelete(task);

    expect(taskServiceSpy.deleteTask).toHaveBeenCalledWith(task.id);
    expect(component.saving).toBeFalse();
    expect(notificationSpy.error).toHaveBeenCalledWith('Error al eliminar');
  });

  // ---------- backToLogin ----------

  it('should logout and navigate back to login', () => {
    component.backToLogin();

    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  // ---------- counters ----------

  it('should calculate pendingCount and completedCount correctly', () => {
    component.tasks = [
      buildTask('1', false),
      buildTask('2', true),
      buildTask('3', false),
    ];

    expect(component.pendingCount).toBe(2);
    expect(component.completedCount).toBe(1);
  });
});
