import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-book',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, MatFormFieldModule,MatInputModule, FormsModule],
  templateUrl: './view-book.component.html',
  styleUrl: './view-book.component.css',
  preserveWhitespaces: true
})
export class ViewBookComponent {
  activatedRoute = inject(ActivatedRoute)
  bookName: any
  router = inject(Router)
  searchKey: any = ''
  constructor(){
    this.activatedRoute.queryParams.subscribe(p => this.bookName = p['book'])
  }

  goBack(){
    this.router.navigate(['/dashboard'])
  }
}
