import { Injectable, computed, signal } from '@angular/core';
import { Todo } from '../models/todo.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private todosSignal = signal<Todo[]>(this.loadTodos());

  readonly todos = this.todosSignal.asReadonly();
  readonly completedTodos = computed(() => this.todosSignal().filter(todo => todo.completed));
  readonly activeTodos = computed(() => this.todosSignal().filter(todo => !todo.completed));
  readonly totalTodos = computed(() => this.todosSignal().length);

  addTodo(title: string): 
  void {
    if (!title.trim()) return;
    this.todosSignal.update(todos => [...todos, 
      { id: Date.now(), title: title.trim(), completed: false, createdAt: new Date() }]);
    this.persistTodos();
  }

  updateTodo(updatedTodo: Todo): void {
    this.todosSignal.update(todos => todos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo));
    this.persistTodos();
  }

  deleteTodo(id: number): void {
    this.todosSignal.update(todos => todos.filter(todo => todo.id !== id));
    this.persistTodos();
  }

  toggleComplete(id: number): void {
    this.todosSignal.update(todos => todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
    this.persistTodos();
  }

  private persistTodos(): void {
    localStorage.setItem('todos', JSON.stringify(this.todosSignal()));
  }

  private loadTodos(): Todo[] {
    const storedTodos = localStorage.getItem('todos');
    return storedTodos ? JSON.parse(storedTodos).map((todo: Todo) => ({ ...todo, createdAt: new Date(todo.createdAt) })) : [];
  }
}
