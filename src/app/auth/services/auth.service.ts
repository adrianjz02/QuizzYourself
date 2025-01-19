import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private formData: any = null;

  saveFormData(data: any) {
    this.formData = data;
  }

  getFormData() {
    return this.formData;
  }
}
