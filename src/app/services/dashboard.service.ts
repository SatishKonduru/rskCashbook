import { inject, Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  url = environment.apiUrl
  
  http = inject(HttpClient)

  constructor() { }
  addNewBook(userId: string,bookName: string){
  return this.http.get(`${this.url}/users/${userId}`).pipe(
      switchMap((user: any) => {
        const updatedBooks = user.books ? [...user.books, { bookTitle: bookName }] : [{ bookTitle: bookName }];
        return this.http.patch(`${this.url}/users/${userId}`, { books: updatedBooks });
      })
    );
  }
  
}
