import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}

  url = environment.apiUrl;

  getTasks(): Observable<any> {
    return this.http.get(`${this.url}/getTasks`);
  }

  addTask(data: any): Observable<any> {
    return this.http.post(`${this.url}/createTask`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }
}
