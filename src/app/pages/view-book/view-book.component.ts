import { CommonModule } from '@angular/common';
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

@Component({
  selector: 'app-view-book',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, MatFormFieldModule,MatInputModule, FormsModule, MatSidenavModule, MatDividerModule, MatToolbarModule, ReactiveFormsModule, MatDatepickerModule, MatCalendar, NgxMaterialTimepickerModule],
  templateUrl: './view-book.component.html',
  styleUrl: './view-book.component.css',
  preserveWhitespaces: true
})
export class ViewBookComponent implements OnInit{
  isDrawerOpen = false;
  activatedRoute = inject(ActivatedRoute)
  bookName: any
  router = inject(Router)
  searchKey: any = ''
  addFrom : any = FormGroup
  fb = inject(FormBuilder)

  constructor(){
    this.activatedRoute.queryParams.subscribe(p => this.bookName = p['book'])
  }
  ngOnInit(): void {
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    this.addFrom = this.fb.group({
      date: [new Date(), Validators.required],
      time: [currentTime, Validators.required],
      amount: [0, Validators.required],
      description: ['', Validators.required]
    })
  }
  goBack(){
    this.router.navigate(['/dashboard'])
  }
  toggleDrawer(): void {
    this.isDrawerOpen = !this.isDrawerOpen;
  }
}
