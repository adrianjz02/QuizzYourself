import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) {
  }

  getUserProfile(email: string): Observable<any> {
    return this.http.get<any>(`http://localhost:4200/api/profile/${email}`);
  }
}
