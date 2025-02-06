import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { AsyncPipe } from '@angular/common';
import { NoTasksComponent } from '../no-tasks/no-tasks.component';

@Component({
  selector: 'app-task-list',
  imports: [AsyncPipe, NoTasksComponent],
  template: `
    <div class="mt-8">
      @if (tasks$ | async) {
        @if (numberOfTasks() > 0) {
          @for (task of tasks(); track task.id) {
            <div class="flex flex-row justify-start mb-2 items-center gap-4">
              <span>{{ task.title }}</span>
              <!-- <app-task-item /> -->

              <!-- <app-task-delete /> -->
            </div>
          }
        } @else {
          <app-no-tasks
            message="Nenhuma tarefa adicionada 😔"
            imageUrl="no_data.svg"
            alt="Sem tarefas adicionadas" />
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent {
  private taskService = inject(TaskService);

  public tasks$ = this.taskService.getTasks();

  public tasks = this.taskService.tasks;

  public numberOfTasks = this.taskService.numberOfTasks;
}
