import {Component} from '@angular/core';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    MatInput,
    MatLabel,
    MatError,
    MatFormField,
    MatButton,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  public authForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

    constructor(private router: Router, private formDataService: AuthService) {
    }

    onSubmit() {
      if (this.authForm.valid) {
        this.formDataService.saveFormData(this.authForm.value);

        alert('Le formulaire est valide');

        this.router.navigate(['/accueil']).then(r => {
          console.log('Navigation vers la page d\'accueil');
        });
      } else {
        alert('Le formulaire est invalide. Veuillez vérifier les champs.');
      }
    }
}
