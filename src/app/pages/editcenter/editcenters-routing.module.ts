import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditcentersComponent } from './editcenters.component';

const routes: Routes = [{
  path: '',
  component: EditcentersComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TablesRoutingModule { }

export const routedComponents = [
  EditcentersComponent
];