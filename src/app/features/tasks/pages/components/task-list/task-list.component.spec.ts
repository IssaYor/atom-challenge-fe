import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TaskListComponent } from './task-list.component';
import { Task } from '../../../../../core/models/task.model';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  const buildTask = (overrides: Partial<Task> = {}): Task => ({
    id: overrides.id ?? '1',
    userId: overrides.userId ?? 'user@test.com',
    title: overrides.title ?? 'Test task',
    description: overrides.description ?? 'Desc',
    completed: overrides.completed ?? false,
    createdAt: overrides.createdAt ?? new Date().toDateString(),
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show loading message when loading is true', () => {
    component.loading = true;
    component.tasks = [];
    fixture.detectChanges();

    const text = fixture.debugElement.nativeElement.textContent as string;

    expect(text).toContain('Cargando tareas');
  });

  it('should show empty state when not loading and no tasks', () => {
    component.loading = false;
    component.tasks = [];
    fixture.detectChanges();

    const text = fixture.debugElement.nativeElement.textContent as string;

    expect(text).toContain('No tienes tareas aún');
  });

  it('should render a list of tasks when data is provided', () => {
    component.loading = false;
    component.tasks = [
      buildTask({ id: '1', title: 'Tarea 1' }),
      buildTask({ id: '2', title: 'Tarea 2' }),
    ];
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('.task-item'));
    expect(items.length).toBe(2);
    expect(items[0].nativeElement.textContent).toContain('Tarea 1');
    expect(items[1].nativeElement.textContent).toContain('Tarea 2');
  });

  it('should emit toggle when onToggle is called', () => {
    const task = buildTask({ id: '1' });
    const spy = spyOn(component.toggle, 'emit');

    component.onToggle(task);

    expect(spy).toHaveBeenCalledWith(task);
  });

  it('should emit edit when onEdit is called', () => {
    const task = buildTask({ id: '2' });
    const spy = spyOn(component.edit, 'emit');

    component.onEdit(task);

    expect(spy).toHaveBeenCalledWith(task);
  });

  it('should emit delete when onDelete is called', () => {
    const task = buildTask({ id: '3' });
    const spy = spyOn(component.delete, 'emit');

    component.onDelete(task);

    expect(spy).toHaveBeenCalledWith(task);
  });

  it('should allow binding of pending and completed counts', () => {
    component.pendingCount = 3;
    component.completedCount = 5;
    fixture.detectChanges();

    expect(component.pendingCount).toBe(3);
    expect(component.completedCount).toBe(5);
  });
});
