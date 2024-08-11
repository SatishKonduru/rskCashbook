import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatCalendar } from '@angular/material/datepicker';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatDividerModule} from '@angular/material/divider';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { globalProperties } from '../../shared/globalProperties';

@Component({
  selector: 'app-edit-transaction',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatToolbarModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatCalendar, MatDatepickerModule, NgxMaterialTimepickerModule,  DragDropModule, MatDividerModule],
  templateUrl: './edit-transaction.component.html',
  styleUrl: './edit-transaction.component.css',
  providers: [DatePipe]
})
export class EditTransactionComponent implements OnInit{

  transactionData: any = {}
  editForm : any = FormGroup
  formBuilder = inject(FormBuilder)
  datePipe = inject(DatePipe)
  bookName: any ;
  userId: any
  userService = inject(UserService)
  toastr = inject(ToastrService)
  emitter = new EventEmitter()
  dialogRef = inject(MatDialogRef<EditTransactionComponent>)
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData : any){
    this.transactionData = dialogData.data
    this.bookName = dialogData.bookName,
    this.userId = dialogData.userId
   
  }
  ngOnInit(): void {
     // Convert the date string to a Date object
     const dateParts = this.transactionData.date.split('/');
     const formattedDate = new Date(+dateParts[2], +dateParts[0] - 1, +dateParts[1]);
 
    this.editForm = this.formBuilder.group({
      date: [new Date(), Validators.required],
      time: ['', Validators.required],
      amount: [0, Validators.required],
      description: ['', Validators.required]
    })
    
    this.editForm.patchValue({
      date: formattedDate,
      amount: this.transactionData.amount,
      description: this.transactionData.description,
      time: this.transactionData.time
    });
   
  }

  updateTransaction(){
    const formData = this.editForm.value
    // const newDate = this.datePipe.transform(formData.date,'dd/MM/YYYY')
    const newDate = this.datePipe.transform(formData.date,'MM/dd/YYYY')
    const data = {
      date: newDate,
      time: formData.time,
      amount: formData.amount,
      description: formData.description
    }
    console.log("Updated Date :", data)
    if(this.transactionData.type == 'cash-in'){
      this.userService.updateCashInEntry(this.userId, this.bookName, data).subscribe({
        next: ()=>{
          this.toastr.success('Transaction Updated Succesfully','Success', globalProperties.toastrConfig)
          this.dialogRef.close()
          this.emitter.emit()
        }
      })
    }
    if(this.transactionData.type == 'cash-out'){
      this.userService.updateCashOutEntry(this.userId, this.bookName, data).subscribe(
        {
          next: ()=>{
            this.toastr.success('Transaction Updated Succesfully','Success', globalProperties.toastrConfig)
            this.dialogRef.close()
            this.emitter.emit()
          }
        }
      )
    }
    
   
  
    
  }
}
