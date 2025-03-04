import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDividerModule,
    MatSnackBarModule,
    TodoItemComponent
  ],
  template: `
    <div class="container mx-auto p-4">
      
      <mat-card class="mb-4">
        <mat-card-header>
          <mat-card-title class="text-2xl font-bold">Todo List</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="flex items-center mt-4">
            <mat-form-field class="w-full">
              <input 
                matInput 
                placeholder="Enter a task" 
                [(ngModel)]="newTaskTitle" 
                (keyup.enter)="addTask()"
              >
            </mat-form-field>
            <button 
              mat-mini-fab 
              color="primary" 
              class="ml-2" 
              (click)="addTask()"
              [disabled]="!newTaskTitle.trim()"
            >
              <mat-icon>add</mat-icon>
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <div class="mt-4">
        <h2 class="text-xl font-semibold mb-2">Tasks ({{ taskList.length }})</h2>

        <div *ngIf="taskList.length === 0" class="text-center py-8 text-gray-500">
          No tasks yet. Add one above!
        </div>

        <div *ngFor="let task of taskList" class="mb-2">
          <app-todo-item 
            [todo]="task" 
            (delete)="removeTask($event)"
            (toggle)="markTaskComplete($event)"
            (edit)="editTask($event)"
          ></app-todo-item>
        </div>
      </div>
      
    </div>
  `
})
export class TodoListComponent implements OnInit {
  taskList: Todo[] = [];  
  newTaskTitle = '';  
  constructor(
    private todoService: TodoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTodos(); 
  }

  loadTodos(): void {
    this.taskList = this.todoService.getTodos();
  }

  addTask(): void {
    if (this.newTaskTitle.trim()) {
      this.todoService.addTodo(this.newTaskTitle);
      this.loadTodos();
      this.newTaskTitle = ''; 
      this.showMessage('Task added!');
    }
  }

  removeTask(id: number): void {
    this.todoService.deleteTodo(id);
    this.loadTodos(); 
    this.showMessage('Task deleted!');
  }

  markTaskComplete(id: number): void {
    this.todoService.toggleComplete(id);
    this.loadTodos(); 
    const task = this.taskList.find(t => t.id === id);
    this.showMessage(task?.completed ? 'Task completed!' : 'Task is now incomplete');
  }

  editTask(task: Todo): void {
    this.todoService.updateTodo(task);
    this.loadTodos();
    this.showMessage('Task updated!');
  }

  private showMessage(msg: string): void {
    this.snackBar.open(msg, 'Close', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }
}
