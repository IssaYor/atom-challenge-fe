import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { TaskFormComponent } from './task-form.component';
import { Task } from '../../../../../core/models/task.model';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit submitTask and submittedForm when form is valid and not saving', () => {
    const submitTaskSpy = spyOn(component.submitTask, 'emit');
    const submittedFormSpy = spyOn(component.submittedForm, 'emit');

    component.saving = false;
    component.form.setValue({
      title: 'My task',
      description: 'Some desc',
    });

    component.submit();

    expect(submitTaskSpy).toHaveBeenCalledWith({
      title: 'My task',
      description: 'Some desc',
    });
    expect(submittedFormSpy).toHaveBeenCalled();
  });

  it('should NOT emit when form is invalid', () => {
    const submitTaskSpy = spyOn(component.submitTask, 'emit');
    const submittedFormSpy = spyOn(component.submittedForm, 'emit');

    component.saving = false;
    component.form.setValue({
      title: '',
      description: 'Desc',
    });

    component.submit();

    expect(submitTaskSpy).not.toHaveBeenCalled();
    expect(submittedFormSpy).not.toHaveBeenCalled();
  });

  it('should NOT emit when saving is true', () => {
    const submitTaskSpy = spyOn(component.submitTask, 'emit');
    const submittedFormSpy = spyOn(component.submittedForm, 'emit');

    component.saving = true;
    component.form.setValue({
      title: 'Valid title',
      description: 'Desc',
    });

    component.submit();

    expect(submitTaskSpy).not.toHaveBeenCalled();
    expect(submittedFormSpy).not.toHaveBeenCalled();
  });

  it('should patch form when editingTask changes to a task', () => {
    const task: Task = {
      id: '1',
      userId: 'user@test.com',
      title: 'Edit title',
      description: 'Edit desc',
      completed: false,
      createdAt: new Date().toDateString(),
    };

    component.editingTask = task;

    component.ngOnChanges({
      editingTask: new SimpleChange(null, task, true),
    });

    expect(component.form.value.title).toBe('Edit title');
    expect(component.form.value.description).toBe('Edit desc');
  });

  it('should reset form when editingTask changes to null', () => {
    const task: Task = {
      id: '1',
      userId: 'user@test.com',
      title: 'To reset',
      description: 'To reset',
      completed: false,
      createdAt: new Date().toDateString(),
    };

    component.editingTask = task;
    component.ngOnChanges({
      editingTask: new SimpleChange(null, task, true),
    });

    expect(component.form.value.title).toBe('To reset');

    component.editingTask = null;
    component.ngOnChanges({
      editingTask: new SimpleChange(task, null, false),
    });

    expect(component.form.value.title).toBeNull();
    expect(component.form.value.description).toBeNull();
  });

  it('should reset form when resetSignal changes', () => {
    component.form.setValue({
      title: 'Something',
      description: 'Something',
    });

    expect(component.form.value.title).toBe('Something');

    component.resetSignal = 1;
    component.ngOnChanges({
      resetSignal: new SimpleChange(0, 1, false),
    });

    expect(component.form.value.title).toBeNull();
    expect(component.form.value.description).toBeNull();
  });

  it('should reset form and emit cancelEdit on onCancelEdit', () => {
    const cancelEditSpy = spyOn(component.cancelEdit, 'emit');

    component.form.setValue({
      title: 'To cancel',
      description: 'To cancel',
    });

    component.onCancelEdit();

    expect(cancelEditSpy).toHaveBeenCalled();
    expect(component.form.value.title).toBeNull();
    expect(component.form.value.description).toBeNull();
  });
});
