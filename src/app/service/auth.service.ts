import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  generateLoginForm() {
    return new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }
  login(username: string, password: string) {
    return this.httpClient.post(environment.backendUrl + '/login', {
      username,
      password,
    });
  }
  jwtDecode(token: string | null) {
    const raw = token;
    if (!token) return null;
    const [headerRaw, payloadRaw] = token.split('.');
    return {
      raw,
      header: JSON.parse(window.atob(headerRaw)),
      payload: JSON.parse(window.atob(payloadRaw)),
    };
  }
}
