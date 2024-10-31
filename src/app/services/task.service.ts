import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http:HttpClient) {

   }

   url = environment.apiUrl;

    getTasks(){
      return this.http.get(this.url + '/getTasks');
    }

}
