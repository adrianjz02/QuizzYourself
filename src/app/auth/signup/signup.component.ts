import {Component} from '@angular/core';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    MatInput,
    MatLabel,
    MatError,
    MatFormField,
    MatButton,
    MatIcon,
    NgIf,
    MatIconButton,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  public hidePassword = true; // Par défaut, le mot de passe est masqué

  public authForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    pseudonyme: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  constructor(private router: Router, private authService: AuthService) {
  }

  onSubmit() {
    if (this.authForm.valid) {
      this.authService.signUp(this.authForm.value).subscribe({
        next: (response) => {
          alert('Inscription réussie : ' + response.message);
          this.router.navigate(['/accueil']);
        },
        error: (error) => {
          alert('Erreur lors de l\'inscription : ' + error.message);
        },
      });
    } else {
      alert('Le formulaire est invalide. Veuillez vérifier les champs.');
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }


  /*  onSubmit() {
      if (this.authForm.valid) {
        this.authService.signUp(this.authForm.value);

        alert('Le formulaire est valide');

        this.router.navigate(['/accueil']).then(r => {
          console.log('Navigation vers la page d\'accueil');
        });
      } else {
        alert('Le formulaire est invalide. Veuillez vérifier les champs.');
      }
    }*/
}
