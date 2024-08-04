import { inject, Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  url = environment.apiUrl
  
  http = inject(HttpClient)

  constructor() { }
  addNewBook(userId: string,bookName: string){
  return  this.http.patch(`${this.url}/users/${userId}`, { books: {title: bookName} });
  }
  
}
