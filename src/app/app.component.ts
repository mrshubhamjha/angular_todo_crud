import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TodoListComponent } from './components/todo-list/todo-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    TodoListComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-100">
      <mat-toolbar color="primary" class="mb-4">
        <span>Angular Todo App</span>
      </mat-toolbar>
      
      <app-todo-list></app-todo-list>
    </div>
  `
})
export class AppComponent {
  title = 'Angular Todo App';
}