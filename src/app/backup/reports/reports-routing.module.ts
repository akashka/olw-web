import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportsComponent } from './reports.component';
// import { SmartTableComponent } from './smart-table/smart-table.component';

const routes: Routes = [{
  path: '',
  component: ReportsComponent,
//   children: [{
//     path: 'smart-table',
//     component: SmartTableComponent,
//   }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TablesRoutingModule { }

export const routedComponents = [
  ReportsComponent,
//   SmartTableComponent,
];
