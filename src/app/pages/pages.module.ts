import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';

import { ThemeModule } from '../@theme/theme.module';
import { PagesRoutingModule } from './pages-routing.module';

import { ECommerceModule } from './e-commerce/e-commerce.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReportsModule } from './reports/reports.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';

import { CenterPageModule } from './center/centers.module';
import { CreatecenterPageModule } from './createcenter/createcenters.module';
import { EditcenterPageModule } from './editcenter/editcenters.module';

import { UserPageModule } from './user/users.module';
import { CreateuserPageModule } from './createuser/createusers.module';
import { EdituserPageModule } from './edituser/editusers.module';

import { EnquiryPageModule } from './enquiry/enquiry.module';
import { ConfirmPageModule } from './confirm/confirm.module';
import { ConfirmstudentPageModule } from './confirmstudent/confirmstudent.module';

import { RestorePageModule } from './restore/restore.module';
import { EditstudentPageModule } from './editstudent/editstudent.module';
import { AdmineditPageModule } from './adminedit/adminedit.module';

import { IndentPageModule } from './indent/indent.module';
import { DispatchPageModule } from './dispatch/dispatch.module';

import { PromotionPageModule } from './promotion/promotion.module';
import { PromotestudentPageModule } from './promotestudent/promotestudent.module';

const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,

    ECommerceModule,
    DashboardModule,
    MiscellaneousModule,
    
    ReportsModule,
    
    CenterPageModule,
    CreatecenterPageModule,
    EditcenterPageModule,
    
    UserPageModule,
    CreateuserPageModule,
    EdituserPageModule,

    EnquiryPageModule,
    ConfirmPageModule,
    ConfirmstudentPageModule,

    IndentPageModule,
    DispatchPageModule,

    PromotionPageModule,
    PromotestudentPageModule,
    
    RestorePageModule,
    EditstudentPageModule,
    AdmineditPageModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
})
export class PagesModule {
}
