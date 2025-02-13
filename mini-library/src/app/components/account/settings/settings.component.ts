import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatDialogModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  isDarkMode = false;

  constructor(private dialog: MatDialog) { }

  toggleDarkMode(event: any) {
    this.isDarkMode = event.checked;

  }

}
