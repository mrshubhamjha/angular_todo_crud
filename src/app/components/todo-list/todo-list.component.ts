import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TodoService } from '../../services/todo.service';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatInputModule, MatButtonModule, 
    MatIconModule, MatCheckboxModule, MatSnackBarModule, TodoItemComponent
  ],
  template: `
    <div class="container mx-auto p-4">
      <mat-card class="mb-4">
        <mat-card-title class="text-2xl font-bold">Todo List</mat-card-title>
        <mat-card-content>
          <div class="flex items-center">
            <mat-form-field class="w-full">
              <input matInput placeholder="Enter a task" [(ngModel)]="newTaskTitle" (keyup.enter)="addTask()">
            </mat-form-field>
            <button mat-mini-fab color="primary" class="ml-2" (click)="addTask()" 
            [disabled]="!newTaskTitle().trim()">
              <mat-icon>add</mat-icon>
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <h2 class="text-xl font-semibold mb-2">Tasks ({{ tasks().length }})</h2>
      <div *ngIf="tasks().length === 0" class="text-center py-8 text-gray-500">No tasks yet. Add one above!</div>

      <app-todo-item *ngFor="let task of tasks()" 
        [todo]="task" 
        (delete)="removeTask($event)"
        (toggle)="toggleTask($event)"
        (edit)="editTask($event)">
      </app-todo-item>
    </div>
  `
})
export class TodoListComponent {
  newTaskTitle = signal('');
  tasks = computed(() => this.todoService.todos());

  constructor
  (private todoService: TodoService, 
    private snackBar: MatSnackBar) {}

  addTask(): void {
    if (!this.newTaskTitle().trim()) return;
    this.todoService.addTodo(this.newTaskTitle());
    this.newTaskTitle.set('');
    this.showMessage('Task added!');
  }

  removeTask(id: number): void {
    this.todoService.deleteTodo(id);
    this.showMessage('Task deleted!');
  }

  toggleTask(id: number): void {
    this.todoService.toggleComplete(id);
    this.showMessage(this.tasks().find(t => t.id === id)?.completed ? 'Task completed!' : 'Task is now incomplete');
  }

  editTask(task: Todo): void {
    this.todoService.updateTodo(task);
    this.showMessage('Task updated!');
  }

  private showMessage(msg: string): void {
    this.snackBar.open(msg, 'Close', { duration: 2000, horizontalPosition: 'end', verticalPosition: 'bottom' });
  }
}
