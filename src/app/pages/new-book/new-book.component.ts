import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { DashboardService } from '../../services/dashboard.service';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { globalProperties } from '../../shared/globalProperties';


@Component({
  selector: 'app-new-book',
  standalone: true,
  imports: [CommonModule,MatDialogModule, MatTooltipModule , MatToolbarModule, MatButtonModule,MatIconModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './new-book.component.html',
  styleUrl: './new-book.component.css'
})
export class NewBookComponent implements OnInit{

  bookForm: any = FormGroup
  fb = inject(FormBuilder)
  dashboard = inject(DashboardService)
  toastr = inject(ToastrService)
  user = inject(UserService)
  userId : any
  dialogRef = inject(MatDialogRef<NewBookComponent>)
  ngOnInit(): void {
    this.bookForm = this.fb.group({
      name: ['', Validators.required]
    })
  }

  async  addNewBook(){
    const formData = this.bookForm.value
    const bookName = formData.name
    let userDetails = this.user.retrieveCredentials()
    console.log('User Details: ', userDetails)
    await  this.user.getUsers().subscribe({
      next: (res: any) => {
        res.find(obj => {
          if(obj.username == userDetails.username && obj.password == userDetails.password){
            this.userId= obj.id
          }
        })
        console.log("User Id: ", this.userId)
        this.dashboard.addNewBook(this.userId, bookName).subscribe({
          next: (res: any) => {
            this.toastr.success(`" ${bookName} " Book Added Succesully.`, 'Success', globalProperties.toastrConfig)
            this.dialogRef.close()
          },
          error: (err: any) => {
            this.toastr.error(`No Book was Added.`, 'Failure', globalProperties.toastrConfig)
            this.dialogRef.close()
          }
        })
      }
     }) 

  

  }
}
