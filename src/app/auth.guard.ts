import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import {AuthService} from './auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      take(1), // Prendre uniquement la première valeur émise
      map(isLoggedIn => {
        if (!isLoggedIn) {
          // Si l'utilisateur n'est pas connecté, rediriger vers la page d'accueil
          this.router.navigate(['/auth/login']).then(() => console.log("Vous n'êtes pas connecté."));
          return false;
        }
        // Sinon, autoriser l'accès
        return true;
      })
    );
  }
}
