import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDividerModule} from '@angular/material/divider';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCalendar, MatDatepickerModule} from '@angular/material/datepicker';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { globalProperties } from '../../shared/globalProperties';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditTransactionComponent } from '../edit-transaction/edit-transaction.component';

@Component({
  selector: 'app-view-book',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, MatFormFieldModule,MatInputModule, FormsModule, MatSidenavModule, MatDividerModule, MatToolbarModule, ReactiveFormsModule, MatDatepickerModule, MatCalendar, NgxMaterialTimepickerModule, MatTableModule, MatPaginatorModule, MatProgressSpinnerModule],
  templateUrl: './view-book.component.html',
  styleUrl: './view-book.component.css',
  preserveWhitespaces: true,
  providers: [DatePipe]
})
export class ViewBookComponent implements OnInit{
  isDrawerOpen = false;
  activatedRoute = inject(ActivatedRoute)
  bookName: any
  router = inject(Router)
  searchKey: any = ''
  addForm : any = FormGroup
  fb = inject(FormBuilder)
  userService = inject(UserService)
  userId: any
  toastr = inject(ToastrService)
  title: any
  entryCode = 0
  cashInMoney:number
  cashOutMoney: number
  entries : any
  dialog = inject(MatDialog)
  displayedColumns: string[] = ['date','time','description','amount','actions']
  @ViewChild(MatPaginator) paginator : MatPaginator
  constructor(private datePipe: DatePipe){
    this.activatedRoute.queryParams.subscribe(p => this.bookName = p['book'])
  }
  ngOnInit(): void {
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    this.addForm = this.fb.group({
      date: [new Date(), Validators.required],
      time: [currentTime, Validators.required],
      amount: [0, Validators.required],
      description: ['', Validators.required]
    })
    this.getTotals()
    this.getEntriesTable()
  }
  goBack(){
    this.router.navigate(['/dashboard'])
  }
  toggleDrawer(): void {
    this.isDrawerOpen = !this.isDrawerOpen;
    this.resetForm()
  }
  toggleDrawerForCashIn(){
    this.isDrawerOpen = !this.isDrawerOpen;
    this.title = 'Add Entry for Cash In'
    this.entryCode = 1
  }
  toggleDrawerForCashOut(){
    this.isDrawerOpen = !this.isDrawerOpen;
    this.title = 'Add Entry for Cash Out'
    this.entryCode = 2
  }
 
getTotals(){
  let userDetails = this.userService.retrieveCredentials()
  this.userService.getUsers().subscribe({
    next: (res: any) => {
      res.find(obj => {
        if(obj.username == userDetails.username && obj.password == userDetails.password){
          console.log("Books: ", obj.books)
          obj.books.forEach((obj: any) => {
            if(obj.bookTitle === this.bookName){
              this.cashInMoney = obj.cashInTotal
              this.cashOutMoney = obj.cashOutTotal 
             }
          } )     
        }
      })
    }
  })
}
async  save(){
    const formData = this.addForm.value
    const transactionDate  = this.datePipe.transform(formData.date,'dd/MM/YYYY')
    const data = {
      date: transactionDate, 
      time: formData.time,
      amount: formData.amount,
      description: formData.description
    }
    console.log("FormData: ", data)
    let userDetails = this.userService.retrieveCredentials()
    console.log('User Details: ', userDetails)
    await  this.userService.getUsers().subscribe({
      next: (res: any) => {
        res.find(obj => {
          if(obj.username == userDetails.username && obj.password == userDetails.password){
            this.userId= obj.id           
          }
        })
        console.log("User Id: ", this.userId)
        
        if(this.entryCode == 1){
          this.userService.cashInEntry(this.userId, this.bookName, data).subscribe({
            next: () => {
              this.toastr.success('Entry Added Successfully.','Success', globalProperties.toastrConfig)
              this.getTotals()
              this.getEntriesTable()
              this.resetForm()
              this.toggleDrawer()
              
            }
            
          })
        }
        if(this.entryCode == 2){
          this.userService.cashOutEntry(this.userId, this.bookName, data).subscribe({
            next: () => {
              this.toastr.success('Entry Added Successfully.','Success', globalProperties.toastrConfig)
              this.getTotals()
              this.getEntriesTable()
              this.resetForm()
              this.toggleDrawer()
              
            }
            
          })
        }
       
      },
      error: (err: any) => {
        this.toastr.error('No Entry Added.','Fail',globalProperties.toastrConfig)
      }
     }) 
  }

  resetForm(){
    const initialTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    this.addForm.setValue({
      date: new Date(),
      time: initialTime,
      amount: 0,
      description: ''
    });
  }

  getEntriesTable(){
    let userDetails = this.userService.retrieveCredentials()
    this.userService.getUsers().subscribe({
      next: (res: any) => {
         res.find(obj => {
          if(obj.username == userDetails.username && obj.password == userDetails.password){
            this.userId= obj.id 
          }
        })
        console.log("User Id: ", this.userId)
        this.userService.entriesTable(this.userId, this.bookName).subscribe({
          next: (entries: any[]) => {
            this.entries = new MatTableDataSource(entries);
            this.entries.paginator = this.paginator
          }

        })
      }
  })
  }
  // isCashIn(entry: any): boolean {
  //   return entry.amount && entry.amount > 0; // Assuming positive amount for cash-in
  // }

  // isCashOut(entry: any): boolean {
  //   return entry.amount && entry.amount < 0; // Assuming negative amount for cash-out
  // }

  get hasEntries(): boolean {
    return this.entries.data.length > 0;
  }
  ngAfterViewInit(){
    this.getEntriesTable()
  }
  applyFilter(value: any){
    this.entries.filter  = value.trim().toLowerCase()
  }
  onSearchClear(){
    this.searchKey = ''
    this.applyFilter('')
  }

  onEdit(data:any){
    const dialogConfig = new MatDialogConfig()
    dialogConfig.width = '800px'
    dialogConfig.disableClose = true
    dialogConfig.autoFocus = true
    dialogConfig.hasBackdrop = true
    dialogConfig.data = {
      data: data
    }
    const dialogRef = this.dialog.open(EditTransactionComponent, dialogConfig)
  }
}
