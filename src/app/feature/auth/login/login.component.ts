import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../service/auth.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthStore } from '../store/auth.store';
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    JsonPipe,
  ],
  providers: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  protected readonly authStore = inject(AuthStore);

  loginForm: FormGroup = this.authService.generateLoginForm();
  onSubmit() {
    console.log('STORE: ', this.authStore);
    if (!this.loginForm.valid) return;
    const { username, password } = this.loginForm.value;
    this.authService.login(username, password).subscribe((r: any) => {
      // console.log('LOGIN RESULT: ', r);
      // console.log('STOREDECODED: ', r, r.token);
      console.log('STOREDECODED: ', this.authStore.decode(r.token));
      this.authStore.setToken(r.token);
      this.router.navigateByUrl('/');
    });
  }
}
