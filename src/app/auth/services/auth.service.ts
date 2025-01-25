import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private signupUrl = '/api/signup';
  private loginUrl = '/api/login';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userEmail: string | null = null; // Propriété pour sauvegarder l'email

  constructor(private http: HttpClient) {
  }

  signUp(userData: any): Observable<any> {
    return this.http.post(this.signupUrl, userData).pipe(
      catchError((error) => {
        console.error(error);
        return throwError(() => new Error(error.message || 'Erreur serveur'));
      })
    );
  }

  // Méthode pour la connexion
  login(userData: any): Observable<any> {
    return this.http.post(this.loginUrl, userData).pipe(
      catchError((error) => {
        console.error(error);
        return throwError(() => new Error(error.message || 'Erreur serveur'));
      })
    ).pipe(
      // Après la connexion, sauvegarder l'email
      catchError((error) => {
        console.error(error);
        return throwError(() => new Error(error.message || 'Erreur serveur'));
      })
    );
  }

  // Méthode pour mettre à jour l'état de connexion
  setLoggedIn(status: boolean, email: string | null = null): void {
    this.isLoggedInSubject.next(status);
    if (status && email) {
      this.userEmail = email; // Sauvegarde de l'email
    } else {
      this.userEmail = null; // Réinitialise l'email en cas de déconnexion
    }
  }

  // Méthode pour récupérer l'email de l'utilisateur connecté
  getUserEmail(): string | null {
    return this.userEmail;
  }

  // Méthode pour obtenir l'état de connexion
  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  logout(): void {
    this.setLoggedIn(false, null); // Met à jour l'état de connexion
    // Optionnel : Supprimez des données spécifiques si nécessaires (ex. : token, session)
    console.log('Déconnexion réussie');
  }


}
