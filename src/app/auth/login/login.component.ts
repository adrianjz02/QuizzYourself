import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatLabel,
    MatError,
    MatFormField,
    MatButton,
    MatInput,
    MatIcon,
    NgIf,
    MatIconButton
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  public hidePassword = true; // Par défaut, le mot de passe est masqué

  public loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  constructor(private router: Router, private authService: AuthService) {
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.authService.setLoggedIn(true, this.loginForm.value.email); // Met à jour l'état de connexion
          alert('Connexion réussie');
          this.router.navigate(['/accueil']).then(r => console.log("Connexion réussi.")); // Redirige vers le tableau de bord après connexion
        },
        error: () => {
          alert('Erreur : Identifiants invalides. Veuillez réessayer.');
        }
      });
    } else {
      alert('Veuillez remplir correctement le formulaire.');
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

}
