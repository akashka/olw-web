import { Component } from '@angular/core';
import * as _ from 'lodash'
import { Auth } from '../../providers/auth/auth';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AUTH_OPTIONS } from '../auth.options';
import { getDeepFromObject } from '../helpers';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.scss'],
})

export class LoginComponent {

  myStorage = window.localStorage;
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  loading: Boolean = false;
  logoState: any = "in";
  cloudState: any = "in";
  loginState: any = "in";
  formState: any = "in";
  errorMessage: string = "";
  submitAttempt: Boolean = false;
  isForgotPassword: Boolean = false;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  options = AUTH_OPTIONS;
  redirectDelay = this.getConfigValue('forms.login.redirectDelay');
  showMessages = this.getConfigValue('forms.login.showMessages');
  strategy = this.getConfigValue('forms.login.strategy');
  socialLinks = this.getConfigValue('forms.login.socialLinks');
  rememberMe = this.getConfigValue('forms.login.rememberMe');

  constructor(
    public authService: Auth,
    public formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.maxLength(30), Validators.pattern("[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?"), Validators.required])],
      password: ['', Validators.compose([Validators.required])],
    });
    this.forgotPasswordForm = formBuilder.group({
      email: ['', Validators.compose([Validators.maxLength(30), Validators.pattern("[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?"), Validators.required])]
    });

    this.loginForm.valueChanges.subscribe(data => {
      this.loginForm.setValue({
        email: (data.email).toLowerCase(),
        password: data.password
      },
        { emitEvent: false });
    });
  }

  ngOnInit() {
    this.loading = true;
    this.authService.checkAuthentication().then((res) => {
      console.log("Already authorized");
      this.loading = false;
      this.router.navigate(['./pages/iot-dashboard']);
    }, (err) => {
      console.log("Not already authorized");
      this.loading = false;
    });
  }

  login() {
    this.loading = true;
    this.submitAttempt = true;
    let credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };
    this.authService.login(credentials).then((result) => {
      this.router.navigate(['./pages/iot-dashboard']);
      // this.loading = false;
    }, (err) => {
      this.errorMessage = "Authentication Failed!";
      this.loading = false;
    });
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  getConfigValue(key) {
    return getDeepFromObject(this.options, key, null);
  };

  tryagain() {
    this.errorMessage = "";
    this.loading = false;
  }

}
