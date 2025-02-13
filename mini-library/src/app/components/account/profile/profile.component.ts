import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: User = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 8900'
  };
}