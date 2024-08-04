import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import { DashboardService } from '../../services/dashboard.service';
import { UserService } from '../../services/user.service';
import { RouterOutlet } from '@angular/router';
import {MatDialog, MatDialogConfig, MatDialogModule} from '@angular/material/dialog';
import { NewBookComponent } from '../new-book/new-book.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatButtonModule, MatIconModule, MatDividerModule, RouterOutlet, MatDialogModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  dialog = inject(MatDialog)

  addBook(){
    const dialogConfig = new MatDialogConfig()
    dialogConfig.autoFocus = true
    dialogConfig.disableClose = true
    dialogConfig.width='700px'
    this.dialog.open(NewBookComponent, dialogConfig)
  }

}
