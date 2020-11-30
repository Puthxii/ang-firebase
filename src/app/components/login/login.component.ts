import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    auth.getCurrentLoggedIn();
  }
  // tslint:disable-next-line: typedef
  ngOnInit() {
    this.buildForm();
  }
  buildForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern('^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$'),
        Validators.minLength(6),
        Validators.maxLength(25)
      ])
    });
  }
  // tslint:disable-next-line: typedef
  get email() {
    return this.loginForm.get('email');
  }
  // tslint:disable-next-line: typedef
  get password() {
    return this.loginForm.get('password');
  }

  login(): void {
    this.auth.emailLogin(this.loginForm.value.email, this.loginForm.value.password);
  }
}
