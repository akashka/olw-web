import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { PagesComponent } from './pages.component';

import { ReportsComponent } from './reports/reports.component';

import { CentersComponent } from './center/centers.component';
import { CreatecentersComponent } from './createcenter/createcenters.component';
import { EditcentersComponent } from './editcenter/editcenters.component';

import { UsersComponent } from './user/users.component';
import { CreateusersComponent } from './createuser/createusers.component';
import { EditusersComponent } from './edituser/editusers.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';

import { EnquiryComponent } from './enquiry/enquiry.component';

import { RestoreComponent } from './restore/restore.component';
import { EditstudentComponent } from './editstudent/editstudent.component';
import { AdmineditComponent } from './adminedit/adminedit.component';

import { ConfirmComponent } from './confirm/confirm.component';
import { ConfirmstudentComponent } from './confirmstudent/confirmstudent.component';

import { IndentComponent } from './indent/indent.component';
import { DispatchComponent } from './dispatch/dispatch.component';

import { PromotionComponent } from './promotion/promotion.component';
import { PromotestudentComponent } from './promotestudent/promotestudent.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'iot-dashboard',
      component: ECommerceComponent,
    },
    {
      path: 'enquiry',
      component: EnquiryComponent,
    },
    {
      path: 'confirm',
      component: ConfirmComponent,
    },
    {
      path: 'confirmstudent/:id',
      component: ConfirmstudentComponent,
    },
    {
      path: 'indent',
      component: IndentComponent,
    },
    {
      path: 'dispatch',
      component: DispatchComponent
    },
    {
      path: 'promotion',
      component: PromotionComponent
    },
    {
      path: 'promotestudent/:id',
      component: PromotestudentComponent
    },
    {
      path: 'centers',
      component: CentersComponent,
    },
    {
      path: 'createcenters',
      component: CreatecentersComponent,
    },
    {
      path: 'editcenters/:id',
      component: EditcentersComponent,
    },
    {
      path: 'users',
      component: UsersComponent,
    },
    {
      path: 'createusers',
      component: CreateusersComponent,
    },
    {
      path: 'editusers/:id',
      component: EditusersComponent,
    },
    {
      path: 'reports',
      component: ReportsComponent,
    },
    {
      path: 'editstudent',
      component: EditstudentComponent,
    },
    {
      path: 'adminedit/:id',
      component: AdmineditComponent
    },
    {
      path: 'restore',
      component: RestoreComponent,
    },
    {
      path: 'miscellaneous',
      loadChildren: './miscellaneous/miscellaneous.module#MiscellaneousModule',
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    }, {
      path: '**',
      component: NotFoundComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
