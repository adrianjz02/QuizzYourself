import {Component} from '@angular/core';
import {AuthService} from '../auth/services/auth.service';
import {RouterOutlet} from '@angular/router';
import {ProfileService} from './services/profile.service';
import {DecimalPipe, NgForOf} from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [
    RouterOutlet,
    DecimalPipe,
    NgForOf
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  protected userProfile: any;
  public userMail: string | null;

  constructor(private authService: AuthService, private profileService: ProfileService) {
    this.userMail = this.authService.getUserEmail(); // Récupération de l'email
  }

  ngOnInit() {
    if (this.userMail) {
      this.profileService.getUserProfile(this.userMail).subscribe({
        next: (data) => {
          this.userProfile = data;
        },
        error: (error) => {
          console.error('Erreur lors du chargement du profil :', error);
        },
        complete: () => {
          // Vous pouvez ajouter du code ici si nécessaire
        }
      });
    }
  }
}


