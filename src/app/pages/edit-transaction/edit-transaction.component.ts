import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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

@Component({
  selector: 'app-edit-transaction',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatToolbarModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatCalendar, MatDatepickerModule, NgxMaterialTimepickerModule,  DragDropModule],
  templateUrl: './edit-transaction.component.html',
  styleUrl: './edit-transaction.component.css'
})
export class EditTransactionComponent implements OnInit{

  transactionData: any = {}
  editForm : any = FormGroup
  formBuilder = inject(FormBuilder)
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData : any){
    this.transactionData = dialogData.data
    console.log("this.transactionData: ", this.transactionData)
  }
  ngOnInit(): void {
     // Convert the date string to a Date object
     const dateParts = this.transactionData.date.split('/');
     const formattedDate = new Date(+dateParts[2], +dateParts[0] - 1, +dateParts[1]);
 
    this.editForm = this.formBuilder.group({
      date: [formattedDate, Validators.required],
      time: [this.transactionData.time, Validators.required],
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
}
