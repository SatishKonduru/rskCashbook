import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { EncryptionService } from './encryption.service';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

 public url = environment.apiUrl 
 public http = inject(HttpClient)
 private _encryption = inject(EncryptionService)
  constructor() { }

  userRegister(data: any){
    return this.http.post<any>(`${this.url}/users`, data)
  }

  storeCredentials(username: string, password: string) {
    const combinedCredentials = `${username}:${password}`;
    const encryptedData = this._encryption.encrypt(combinedCredentials);
    sessionStorage.setItem('userCredentials', encryptedData);
  }

  retrieveCredentials(): { username: string, password: string } | null {
    const encryptedData = sessionStorage.getItem('userCredentials');
    if (encryptedData) {
      const decryptedData = this._encryption.decrypt(encryptedData);
      const [username, password] = decryptedData.split(':');
      return { username, password };
    }
    return null;
  }

  getUsers(){
    return this.http.get<any>(`${this.url}/users`)
  }
  
  addCashIn(userId: any, bookName: any, data: any) {
    return this.http.get(`${this.url}/users/${userId}`).pipe(
      switchMap((user: any) => {
        // Find the book and update it
        const updatedBooks = user.books.map((book: any) => {
          if (book.bookTitle === bookName) {
            // Add new entry to the book
            return {
              ...book,
              entries: [...(book.entries || []), data]
            };
          }
          return book;
        });

        // Update the user with the modified books
        return this.http.patch(`${this.url}/users/${userId}`, { books: updatedBooks });
      })
    );
  }
}

  

