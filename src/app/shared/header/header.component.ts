import {Component} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../auth/services/auth.service';
import {NgIf} from '@angular/common';
import {NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import {Modal} from 'bootstrap';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    NgIf,
    NgbDatepickerModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  onLogout(): void {
    this.authService.logout(); // Déconnexion via le service
  }

  onProfileClick(event: Event): void {
    if (!this.isLoggedIn) {
      event.preventDefault(); // Empêche la navigation
      const modalElement = document.getElementById('exampleModal');
      if (modalElement) {
        const modal = new Modal(modalElement); // Crée une instance du modal
        modal.show(); // Affiche le modal
        this.router.navigate(['/auth/login']).then(() => console.log('Redirection vers la page de connexion'));
      }
    } else {
      // Redirige uniquement si l'utilisateur est connecté
      this.router.navigate(['/profile']).then(() => console.log('Redirection vers le profil utilisateur'));
    }
  }

  goToHome() {
    this.router.navigate(['/accueil']).then(() => {
      window.location.reload();
    });
  }

}
