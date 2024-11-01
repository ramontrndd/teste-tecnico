import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTasks(): Observable<any> {
    return this.http.get(`${this.url}/getTasks`);
  }

  addTask(data: any): Observable<any> {
    return this.http.post(`${this.url}/createTask`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  deleteTask(id: any): Observable<any> {
    return this.http.delete(`${this.url}/deleteTask/${id}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  updateTask(data: any): Observable<any> {
    return this.http.patch(`${this.url}/updateTask/${data.id}`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  // Adiciona o método para reorganizar as tarefas
  reorderTasks(taskIds: string[]): Observable<void> {
    return this.http.post<void>(`${this.url}/reorderTasks`, { taskIds }); // Envia o array de taskIds para o backend
  }
}
