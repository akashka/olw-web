import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreatecentersComponent } from './createcenters.component';

const routes: Routes = [{
  path: '',
  component: CreatecentersComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TablesRoutingModule { }

export const routedComponents = [
  CreatecentersComponent
];