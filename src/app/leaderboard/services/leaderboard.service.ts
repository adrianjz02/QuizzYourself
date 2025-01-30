import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  private apiUrl = '/api/init-total-score'; // URL de l'API MirageJS

  constructor(private http: HttpClient) {
  }
  // Récupère les scores des joueurs
  getTotalScores(): Observable<any> {
    return this.http.post<any>(this.apiUrl, {});
  }

  getUserByEmail(email: string): Observable<{ pseudonyme: string }> {
    return this.http.get<{ pseudonyme: string }>(`/api/get-user/${email}`);
  }

}
