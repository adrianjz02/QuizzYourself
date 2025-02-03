import {Component} from '@angular/core';
import {AuthService} from '../../auth/services/auth.service';
import {ProfileService} from '../services/profile.service';
import {DecimalPipe, NgForOf, NgOptimizedImage} from '@angular/common';
import {GraphService} from '../dashboard/services/graph-service.service';

@Component({
  selector: 'app-profile',
  imports: [
    DecimalPipe,
    NgForOf,
    NgOptimizedImage
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  protected userProfile: any;
  public userMail: string | null;
  averageResponseTime: number | null = null;

  constructor(private authService: AuthService, private profileService: ProfileService, private graphService: GraphService) {
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

      // Appel pour récupérer le temps de réponse moyen
      this.graphService.getTempsReponse().subscribe({
        next: (data) => {
          // Supposons que l'API renvoie un objet avec la propriété "moyenneTempsReponse"
          if (data && data.moyenneTempsReponse) {
            this.averageResponseTime = data.moyenneTempsReponse;
            console.log('Temps de réponse moyen récupéré :', this.averageResponseTime);
          }
        },
        error: (error) => {
          console.error('Erreur lors de la récupération du temps de réponse moyen :', error);
        }
      });
    }
  }

  // Cette méthode retourne l'URL complète de l'avatar
  getAvatarUrl(): string {
    if (this.userProfile && this.userProfile.user && this.userProfile.user.avatar) {
      return this.userProfile.user.avatar;
    }
    return 'avatar1.png';
  }


}


