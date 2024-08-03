import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { globalProperties } from '../../shared/globalProperties';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { EncryptionService } from '../../services/encryption.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, 
            ReactiveFormsModule,
            MatFormFieldModule,
            MatInputModule,
            MatButtonModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  loginForm: any = FormGroup
  public fb = inject(FormBuilder)
  private _encryption = inject(EncryptionService)
  private _user = inject(UserService)
  private _router = inject(Router)

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['',[Validators.required, Validators.pattern(globalProperties.nameRegx)]],
      password: ['', Validators.required]
    })
  }

  onLogin(){
    const formData = this.loginForm.value
    console.log("Form Data: ", formData)
    const username = formData.username
    const password = formData.password
    this._user.storeCredentials(username, password)
    
  }

}
