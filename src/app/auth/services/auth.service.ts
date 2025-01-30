import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private signupUrl = '/api/signup';
  private loginUrl = '/api/login';
  private isLoggedInSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('userEmail'));
  private userEmail: string | null = localStorage.getItem('userEmail');

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

  login(userData: any): Observable<any> {
    return this.http.post(this.loginUrl, userData).pipe(
      catchError((error) => {
        console.error(error);
        return throwError(() => new Error(error.message || 'Erreur serveur'));
      })
    );
  }

  setLoggedIn(status: boolean, email: string | null = null): void {
    this.isLoggedInSubject.next(status);
    if (status && email) {
      this.userEmail = email;
      localStorage.setItem('userEmail', email);
    } else {
      this.userEmail = null;
      localStorage.removeItem('userEmail');
    }
  }

  getUserEmail(): string | null {
    return this.userEmail || localStorage.getItem('userEmail');
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  logout(): void {
    this.setLoggedIn(false, null);
    localStorage.removeItem('userEmail');
    console.log('Déconnexion réussie');
  }
}
