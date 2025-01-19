import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private signupUrl = '/api/signup';
  private loginUrl = '/api/login';


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
}
