import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

 public url = environment.apiUrl 
 public http = inject(HttpClient)
  constructor() { }

  userRegister(data: any){
    return this.http.post<any>(`${this.url}/users`, data)
  }
}
