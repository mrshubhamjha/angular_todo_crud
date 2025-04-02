import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatCheckboxModule, MatButtonModule, MatIconModule, MatInputModule],
  template: `
    <mat-card class="mb-2">
      <div class="flex items-center p-3" *ngIf="!isEditing()">
        <mat-checkbox 
        [checked]="todo().completed" 
        (change)="toggle.emit(todo().id)" color="primary" class="mr-3"></mat-checkbox>
        
        <span class="flex-grow" [class.line-through]="todo().completed" [class.text-gray-500]="todo().completed">
          {{ todo().title }}
        </span>
        
        <div class="flex">
          <button mat-icon-button color="primary" (click)="startEditing()"><mat-icon>edit</mat-icon></button>
          <button mat-icon-button color="warn" (click)="delete.emit(todo().id)"><mat-icon>delete</mat-icon></button>
        </div>
      </div>

      <div class="flex items-center p-3" *ngIf="isEditing()">
        <input 
          matInput 
          [ngModel]="editedTitle()" 
          (ngModelChange)="editedTitle.set($event)" 
          class="flex-grow p-2 border rounded mr-2"
          (keyup.enter)="saveEdit()" 
          (keyup.escape)="isEditing.set(false)"
        >
        <button mat-icon-button color="primary" (click)="saveEdit()" [disabled]="!editedTitle().trim()">
          <mat-icon>check</mat-icon>
        </button>
        <button mat-icon-button color="warn" (click)="isEditing.set(false)">
          <mat-icon>close</mat-icon>
        </button>
      </div>
    </mat-card>
  `,
  styles: [':host { display: block; width: 100%; }']
})
export class TodoItemComponent {
  // Reactive inputs & outputs
  todo = input.required<Todo>();
  delete = output<number>();
  toggle = output<number>();
  edit = output<Todo>();

  // Signals for state management
  isEditing = signal(false);
  editedTitle = signal('');

  startEditing(): void {
    this.editedTitle.set(this.todo().title);
    this.isEditing.set(true);
  }

  saveEdit(): void {
    const title = this.editedTitle().trim();
    if (title) {
      this.edit.emit({ ...this.todo(), title });
      this.isEditing.set(false);
    }
  }
}
