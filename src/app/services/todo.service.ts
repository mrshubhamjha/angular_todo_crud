import { Injectable } from '@angular/core';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todos: Todo[] = JSON.parse(localStorage.getItem('todos') || '[]');

  constructor() {
    this.updateTodos(); 
  }

  getTodos(): Todo[] {
    return [...this.todos]; 
  }

  addTodo(title: string): void {
    this.todos.push({ id: Date.now(), title, completed: false, createdAt: new Date() });
    this.updateTodos();
  }

  updateTodo(updatedTodo: Todo): void {
    const index = this.todos.findIndex(todo => todo.id === updatedTodo.id);
    if (index !== -1) {
      this.todos[index] = { ...updatedTodo };
      this.updateTodos();
    }
  }

  deleteTodo(id: number): void {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.updateTodos();
  }

  toggleComplete(id: number): void {
    const todo = this.todos.find(todo => todo.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.updateTodos();
    }
  }

  private updateTodos(): void {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }
}
