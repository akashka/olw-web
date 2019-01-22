import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateusersComponent } from './createusers.component';

const routes: Routes = [{
  path: '',
  component: CreateusersComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TablesRoutingModule { }

export const routedComponents = [
  CreateusersComponent
];