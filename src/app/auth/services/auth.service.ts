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

  constructor(private http: HttpClient) {}

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
    );
  }

  // Méthode pour mettre à jour l'état de connexion
  setLoggedIn(status: boolean): void {
    this.isLoggedInSubject.next(status);
  }

  // Méthode pour obtenir l'état de connexion
  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  logout(): void {
    this.setLoggedIn(false); // Met à jour l'état de connexion
    // Optionnel : Supprimez des données spécifiques si nécessaires (ex. : token, session)
    console.log('Déconnexion réussie');
  }


}
