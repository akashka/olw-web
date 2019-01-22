import { Component } from '@angular/core';
import * as _ from 'lodash'
import { Auth } from '../../providers/auth/auth';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AUTH_OPTIONS } from '../auth.options';
import { getDeepFromObject } from '../helpers';
import { Router } from '@angular/router';

@Component({
  selector: 'resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.scss'],
})

export class ResetpasswordComponent {

  myStorage = window.localStorage;
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  logoState: any = "in";
  cloudState: any = "in";
  loginState: any = "in";
  formState: any = "in";
  errorMessage: string = "";
  submitAttempt: Boolean = false;
  isForgotPassword: Boolean = false;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  loading: Boolean = false;

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
    this.forgotPasswordForm = formBuilder.group({
      email: ['', Validators.compose([Validators.maxLength(30), Validators.pattern("[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?"), Validators.required])]
    });

    this.forgotPasswordForm.valueChanges.subscribe(data => {
      this.forgotPasswordForm.setValue({
        email: (data.email).toLowerCase()
      },
        { emitEvent: false });
    });
  }

  ngOnInit() {
    console.log('authenticate');
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

  requestPass() {
    this.submitAttempt = true;
    this.loading = true;
    let credentials = {
      email: this.forgotPasswordForm.value.email,
    };
    this.authService.forgotPassword(credentials).then((result) => {
      this.router.navigate(['../auth']);
      this.loading = false;
    }, (err) => {
      this.errorMessage = "Authentication Failed!";
      this.loading = false;
    });
  }

  getConfigValue(key) {
    return getDeepFromObject(this.options, key, null);
  };

  tryagain() {
    this.errorMessage = "";
    this.loading = false;
  }

}
