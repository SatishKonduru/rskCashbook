import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { EncryptionService } from './encryption.service';
import { map, Observable, switchMap } from 'rxjs';

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

  
  cashInEntry(userId: any, bookName: any, data: any): Observable<any> {
    return this.http.get(`${this.url}/users/${userId}`).pipe(
      switchMap((user: any) => {
        // Find the book and update it
        const updatedBooks = user.books.map((book: any) => {
          if (book.bookTitle === bookName) {
            // Add new entry to the book
            const updatedBook = {
              ...book,
              cashInEntries: [...(book.cashInEntries || []), data]
            };

            // Calculate the new cashInTotal
            const cashInTotal = (updatedBook.cashInEntries || []).reduce((sum: number, entry: any) => sum + parseFloat(entry.amount), 0);

            return {
              ...updatedBook,
              cashInTotal: cashInTotal // Add the total to the book
            };
          }
          return book;
        });

        // Update the user with the modified books
        return this.http.patch(`${this.url}/users/${userId}`, { books: updatedBooks });
      })
    );
  }

  cashOutEntry(userId: any, bookName: any, data: any): Observable<any> {
    return this.http.get(`${this.url}/users/${userId}`).pipe(
      switchMap((user: any) => {
        // Find the book and update it
        const updatedBooks = user.books.map((book: any) => {
          if (book.bookTitle === bookName) {
            // Add new entry to the book
            const updatedBook = {
              ...book,
              cashOutEntries: [...(book.cashOutEntries || []), data]
            };

            // Calculate the new cashInTotal
            const cashOutTotal = (updatedBook.cashOutEntries || []).reduce((sum: number, entry: any) => sum + parseFloat(entry.amount), 0);

            return {
              ...updatedBook,
              cashOutTotal: cashOutTotal // Add the total to the book
            };
          }
          return book;
        });

        // Update the user with the modified books
        return this.http.patch(`${this.url}/users/${userId}`, { books: updatedBooks });
      })
    );
  }

  entriesTable(userId: any, bookName: any) {
    return this.http.get(`${this.url}/users/${userId}`).pipe(
      map((user: any) => {
        const book = user.books.find((b: any) => b.bookTitle === bookName);
        if (book) {
          const cashInEntries = book.cashInEntries || [];
          const cashOutEntries = book.cashOutEntries || [];
          const combinedEntries = [...cashInEntries, ...cashOutEntries];

          combinedEntries.sort((a: any, b: any) => {
            const dateTimeA = this.parseDateTime(a.date, a.time);
            const dateTimeB = this.parseDateTime(b.date, b.time);
            return dateTimeB.getTime() - dateTimeA.getTime();
          });

          // Add a type property to distinguish entries
          return combinedEntries.map(entry => ({
            ...entry,
            type: cashInEntries.includes(entry) ? 'cash-in' : 'cash-out'
          }));
        }
        return [];
      })
    );
  }

  parseDateTime(date: string, time: string): Date {
    return new Date(`${date} ${time}`);
  }
}

  

