import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login2',
  templateUrl: './login2.component.html',
  styleUrls: ['./login2.component.scss']
})
export class Login2Component implements OnInit {

  loginForm: FormGroup;
  constructor(
    private fb: FormBuilder,
  ) { }

  // tslint:disable-next-line: typedef
  ngOnInit() {
    this.buildForm();
  }
  buildForm(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', []),
      password: new FormControl('', [])
    });
  }
  // tslint:disable-next-line: typedef
  loin() {
    return;
  }

}
