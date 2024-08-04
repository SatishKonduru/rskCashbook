import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, RouterModule, MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  router = inject(Router)
  private _user = inject(UserService)
  public username: any = signal('')
  ngOnInit(): void {
    this.getUser()
  }
  login(){
    this.router.navigate(['/login'])
  }
  register(){
    this.router.navigate(['/register'])
  }
  ngAfterViewChecked(){
    this.getUser()
  }
  getUser(){
    const user = sessionStorage.getItem('userCredentials') 
    if(user){
      const userDetails = this._user.retrieveCredentials().username
      this.username.update(username => username = userDetails)
      // console.log("Logged username: ", userDetails)
    }
  }
  logout(){
    sessionStorage.removeItem('userCredentials')
    this.username.update(u => u = '')
    this.router.navigate(['/home'])
  }
}
