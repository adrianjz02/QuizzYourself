import {Component, inject, signal, TemplateRef, WritableSignal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../auth/services/auth.service';
import {NgIf} from '@angular/common';
import {NgbDatepickerModule, NgbOffcanvas, OffcanvasDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Modal} from 'bootstrap';
import {Router} from '@angular/router';

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

  // Pour le offcanva
  private offcanvasService = inject(NgbOffcanvas);
  closeResult: WritableSignal<string> = signal('');

  open(content: TemplateRef<any>) {
    this.offcanvasService.open(content, {ariaLabelledBy: 'offcanvas-basic-title'}).result.then(
      (result) => {
        this.closeResult.set(`Closed with: ${result}`);
      },
      (reason) => {
        this.closeResult.set(`Dismissed ${this.getDismissReason(reason)}`);
      },
    );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case OffcanvasDismissReasons.ESC:
        return 'by pressing ESC';
      case OffcanvasDismissReasons.BACKDROP_CLICK:
        return 'by clicking on the backdrop';
      default:
        return `with: ${reason}`;
    }
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
      this.router.navigate(['/user/profile']).then(() => console.log('Redirection vers le profil utilisateur'));
    }
  }

}
