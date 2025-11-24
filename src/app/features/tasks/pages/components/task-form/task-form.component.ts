import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  OnChanges,
  inject,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { Task } from "../../../../../core/models/task.model";
import { CreateTaskRequest } from "../../../../../core/services/task/task.service";

@Component({
  standalone: true,
  selector: "app-task-form",
  templateUrl: "./task-form.component.html",
  styleUrls: ["./task-form.component.scss"],
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule],
})
export class TaskFormComponent implements OnChanges {
  @Input() editingTask: Task | null = null;
  @Input() saving = false;
  @Input() errorMessage: string | null = null;

  @Output() submittedForm = new EventEmitter<void>();
  @Input() resetSignal = 0;

  @Output() submitTask = new EventEmitter<CreateTaskRequest>();
  @Output() cancelEdit = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  form = this.fb.group({
    title: ["", [Validators.required, Validators.maxLength(100)]],
    description: ["", [Validators.maxLength(500)]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["resetSignal"]) {
      this.form.reset();
    }

    if (changes["editingTask"]) {
      if (this.editingTask) {
        this.form.patchValue({
          title: this.editingTask.title,
          description: this.editingTask.description ?? "",
        });
      } else {
        this.form.reset();
      }
    }
  }

  get title() {
    return this.form.controls.title;
  }

  get description() {
    return this.form.controls.description;
  }

  submit(): void {
    if (this.form.invalid || this.saving) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: CreateTaskRequest = {
      title: this.title.value!.trim(),
      description: this.description.value?.trim() ?? "",
    };

    this.submitTask.emit(payload);
    this.submittedForm.emit();
  }

  onCancelEdit(): void {
    this.form.reset();
    this.cancelEdit.emit();
  }
}
