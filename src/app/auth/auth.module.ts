import { NgModule } from '@angular/core';

import { AuthComponent } from './auth.component';

import { ThemeModule } from '../@theme/theme.module';
import { AuthRoutingModule } from './auth-routing.module';

import { LoginPageModule } from './login/login.module';
import { ResetpasswordPageModule } from './resetpassword/resetpassword.module';

const AUTH_COMPONENTS = [
  AuthComponent,
];

@NgModule({
  imports: [
    AuthRoutingModule,
    ThemeModule,
    LoginPageModule,
    ResetpasswordPageModule,
  ],
  declarations: [
    ...AUTH_COMPONENTS,
  ],
})

export class AuthModule {
}
