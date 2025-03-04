import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule
  ],
  template: `
    <mat-card class="mb-2">
      <div class="flex items-center p-3" *ngIf="!isEditing">
        <mat-checkbox 
          [checked]="todo.completed"
          (change)="toggleComplete()"
          color="primary"
          class="mr-3"
        ></mat-checkbox>
        
        <span 
          class="flex-grow"
          [class.line-through]="todo.completed"
          [class.text-gray-500]="todo.completed"
        >
          {{ todo.title }}
        </span>
        
        <div class="flex">
          <button mat-icon-button color="primary" (click)="startEditing()">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="onDelete()">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </div>
      
      <div class="flex items-center p-3" *ngIf="isEditing">
        <input 
          matInput 
          [(ngModel)]="editedTitle" 
          class="flex-grow p-2 border rounded mr-2"
          (keyup.enter)="saveEdit()"
        >
        <button mat-icon-button color="primary" (click)="saveEdit()">
          <mat-icon>check</mat-icon>
        </button>
        <button mat-icon-button color="warn" (click)="cancelEdit()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
    </mat-card>
  `
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() delete = new EventEmitter<number>();
  @Output() toggle = new EventEmitter<number>();
  @Output() edit = new EventEmitter<Todo>();

  isEditing = false;
  editedTitle = '';

  onDelete(): void {
    this.delete.emit(this.todo.id);
  }

  toggleComplete(): void {
    this.toggle.emit(this.todo.id);
  }

  startEditing(): void {
    this.isEditing = true;
    this.editedTitle = this.todo.title;
  }

  saveEdit(): void {
    if (this.editedTitle.trim()) {
      const updatedTodo = { ...this.todo, title: this.editedTitle.trim() };
      this.edit.emit(updatedTodo);
      this.isEditing = false;
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
  }
}