import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {AuthService} from '../../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getPartiesJouees(): Observable<any> {
    const email = this.authService.getUserEmail();
    if (!email) {
      throw new Error('Utilisateur non connecté ou email non défini.');
    }
    return this.http.get<any>(`/api/parties_jouees?email=${(email)}`);
  }


  getTauxReussite(): Observable<any> {
    const email = this.authService.getUserEmail();
    if (!email) {
      throw new Error('Utilisateur non connecté ou email non défini.');
    }
    return this.http.get<any>(`/api/taux_reussite?email=${email}`).pipe(
      tap(response => console.log('Réponse de taux_reussite:', response))
    );
  }

  getEvolutionScores(): Observable<any> {
    const email = this.authService.getUserEmail();
    if (!email) {
      throw new Error('Utilisateur non connecté ou email non défini.');
    }
    return this.http.get<any>(`/api/evolution_scores?email=${(email)}`);
  }

  getTempsReponse(): Observable<any> {
    const email = this.authService.getUserEmail();
    if (!email) {
      throw new Error('Utilisateur non connecté ou email non défini.');
    }
    // Appel de l'endpoint Mirage JS défini dans /api/tempsMoyen/:email
    return this.http.get<any>(`/api/tempsMoyen/${email}`).pipe(
      tap(response => console.log('Réponse de l\'API :', response))
    );
  }

  getAverageTempsReponse(): Observable<any> {
    return this.http.get('/api/tempsMoyenGlobal').pipe(
      tap(response => console.log('Réponse de l\'API :', response))
    );
  }

  //  Max parties
  getMaxParties(): Observable<any> {
    return this.http.get('/api/max_parties');
  }

  // Moyenne parties
  getAverageParties(): Observable<any> {
    return this.http.get('/api/average_parties');
  }
}
