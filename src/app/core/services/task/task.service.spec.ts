import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TaskService, CreateTaskRequest } from './task.service';
import { API_URL } from '../../../environments/api-url.token';
import { Task } from '../../models/task.model';


describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  const mockApiUrl = 'https://test-api.example.com';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TaskService,
        { provide: API_URL, useValue: mockApiUrl },
      ],
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get tasks with GET /api/tasks', () => {
    const mockTasks: Task[] = [
      {
        id: '1',
        userId: 'user@test.com',
        title: 'Primera',
        description: 'Desc 1',
        completed: false,
        createdAt: new Date().toDateString(),
      },
      {
        id: '2',
        userId: 'user@test.com',
        title: 'Segunda',
        description: '',
        completed: true,
        createdAt: new Date().toDateString(),
      },
    ];

    service.getTasks().subscribe((tasks) => {
      expect(tasks.length).toBe(2);
      expect(tasks[0].title).toBe('Primera');
    });

    const req = httpMock.expectOne(`${mockApiUrl}/api/tasks`);
    expect(req.request.method).toBe('GET');

    req.flush(mockTasks);
  });

  it('should create a task with POST /api/tasks', () => {
    const payload: CreateTaskRequest = {
      title: 'Nueva tarea',
      description: 'Detalle',
    };

    const mockTask: Task = {
      id: 'abc',
      userId: 'user@test.com',
      title: payload.title,
      description: payload.description ?? '',
      completed: false,
      createdAt: new Date().toDateString(),
    };

    service.createTask(payload).subscribe((task) => {
      expect(task.id).toBe('abc');
      expect(task.title).toBe(payload.title);
    });

    const req = httpMock.expectOne(`${mockApiUrl}/api/tasks`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush(mockTask);
  });

  it('should update a task with PUT /api/tasks/:id', () => {
    const id = 'task-1';
    const payload: Partial<CreateTaskRequest> = {
      title: 'Título actualizado',
    };

    const mockUpdated: Task = {
      id,
      userId: 'user@test.com',
      title: payload.title!,
      description: 'Old desc',
      completed: false,
      createdAt: new Date().toDateString(),
    };

    service.updateTask(id, payload).subscribe((task) => {
      expect(task.id).toBe(id);
      expect(task.title).toBe(payload.title!);
    });

    const req = httpMock.expectOne(`${mockApiUrl}/api/tasks/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);

    req.flush(mockUpdated);
  });

  it('should toggle completed using PUT /api/tasks/:id', () => {
    const original: Task = {
      id: 'task-2',
      userId: 'user@test.com',
      title: 'Tarea toggle',
      description: '',
      completed: false,
      createdAt: new Date().toDateString(),
    };

    const updated: Task = {
      ...original,
      completed: true,
    };

    service.toggleCompleted(original).subscribe((task) => {
      expect(task.completed).toBeTrue();
    });

    const req = httpMock.expectOne(
      `${mockApiUrl}/api/tasks/${original.id}`
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.completed).toBeTrue();

    req.flush(updated);
  });

  it('should delete a task with DELETE /api/tasks/:id', () => {
    const id = 'task-delete';

    service.deleteTask(id).subscribe((resp) => {
        expect(resp).toBeNull();
    });

    const req = httpMock.expectOne(`${mockApiUrl}/api/tasks/${id}`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });
});
