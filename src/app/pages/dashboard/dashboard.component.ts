import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import { DashboardService } from '../../services/dashboard.service';
import { UserService } from '../../services/user.service';
import { RouterOutlet } from '@angular/router';
import {MatDialog, MatDialogConfig, MatDialogModule} from '@angular/material/dialog';
import { NewBookComponent } from '../new-book/new-book.component';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatButtonModule, MatIconModule, MatDividerModule, RouterOutlet, MatDialogModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  dialog = inject(MatDialog)
  user = inject(UserService)
 books: any = []

  ngOnInit(): void {
    this.getBooks()
  }
  addBook(){
    const dialogConfig = new MatDialogConfig()
    dialogConfig.autoFocus = true
    dialogConfig.disableClose = true
    dialogConfig.width='700px'
    const ref = this.dialog.open(NewBookComponent, dialogConfig)
    ref.componentInstance.emitter.subscribe({
      next: (res: any) => {
        this.getBooks()
      }
    })
  }

  getBooks(){
     const {username, password} =  this.user.retrieveCredentials()
     console.log("Username: ", username)
     console.log("Password: ", password)
      this.user.getUsers().subscribe({
        next: (res: any) => {
          console.log("USERS :", res)
          res.forEach(user => {
            if(user.username == username && user.password == password){
                 this.books = user.books
              }
          });
          console.log("Books List: ", this.books)
        },
        error: (err: any) => {
          console.log("Error", err)
        }
      })
    }
}
