import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../../../category/services/category.service';
import { createTaskForm } from '../../../constants/create-task-form';
import { Task } from '../../../model/task.model';
import { TaskService } from '../../../services/task.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { delay, finalize } from 'rxjs/operators';
import { NgClass } from '@angular/common';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';

const MODULES = [
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  FormsModule,
  ReactiveFormsModule,
];

const COMMONS = [NgClass];

@Component({
    selector: 'app-include-task-form',
    imports: [...MODULES, ...COMMONS],
    template: `
    <form
      [ngClass]="{
        'cursor-not-allowed animate-pulse': isIncludeTaskFormDisabled(),
        'cursor-pointer': !isIncludeTaskFormDisabled(),
      }"
      autocomplete="off"
      class="flex flex-row gap-2 select-none"
      [formGroup]="newTaskForm">
      <mat-form-field class="w-full">
        <mat-label for="title" data-testid="titleLabel">Tarefa</mat-label>
        <input
          formControlName="title"
          matInput
          placeholder="Adicionar tarefa"
          (keyup.enter)="onEnterToAddATask()" />
        <mat-hint class="text-tertiary">Aperte enter para adicionar</mat-hint>
      </mat-form-field>
      <mat-form-field>
        <mat-label for="categoryId" data-testid="categoryIdLabel"
          >Categoria</mat-label
        >
        <mat-select
          data-testid="matSelect"
          formControlName="categoryId"
          (selectionChange)="selectionChangeHandler($event)"
          (keyup.enter)="onEnterToAddATask()">
          @for (category of categories(); track category.id) {
            <mat-option value="{{ category.id }}">{{
              category.name
            }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
    </form>
  `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncludeTaskFormComponent {
  private readonly categoryService = inject(CategoryService);

  private readonly taskService = inject(TaskService);

  private readonly snackBarService = inject(SnackBarService);

  public readonly categories = this.categoryService.categories;

  public readonly newTaskForm = createTaskForm();

  private readonly destroy$ = inject(DestroyRef);

  public isIncludeTaskFormDisabled = computed(() => {
    if (this.taskService.isLoadingTask()) {
      this.newTaskForm.disable();

      return this.taskService.isLoadingTask();
    }

    this.newTaskForm.enable();

    return this.taskService.isLoadingTask();
  });

  public selectionChangeHandler(event: MatSelectChange): void {
    const categoryId = event.value;
    this.categoryService.selectedCategoryId.set(categoryId);
  }

  public onEnterToAddATask(): void {
    if (this.newTaskForm.invalid) return;

    this.taskService.isLoadingTask.set(true);

    const { title, categoryId } = this.newTaskForm.value;

    const newTask: Partial<Task> = {
      title,
      categoryId,
      isCompleted: false,
    };

    this.taskService
      .createTask(newTask)
      .pipe(
        delay(4000),
        finalize(() => this.taskService.isLoadingTask.set(false)),
        takeUntilDestroyed(this.destroy$)
      )
      .subscribe({
        next: task => this.taskService.insertATaskInTheTasksList(task),
        error: error => {
          this.snackBarConfigHandler(error.message);
        },
        complete: () => this.snackBarConfigHandler('Tarefa incluída'),
      });
  }

  public snackBarConfigHandler(message: string): void {
    this.snackBarService.showSnackBar(message, 4000, 'end', 'top');
  }
}
