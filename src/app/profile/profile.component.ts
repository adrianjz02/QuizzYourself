import {Component} from '@angular/core';
import {AuthService} from '../auth/services/auth.service';
import {RouterLink, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  public userMail: string | null;

  constructor(private authService: AuthService) {
    this.userMail = this.authService.getUserEmail(); // Récupération de l'email
  }

}
