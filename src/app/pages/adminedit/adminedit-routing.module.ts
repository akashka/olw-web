import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdmineditComponent } from './adminedit.component';

const routes: Routes = [{
  path: '',
  component: AdmineditComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TablesRoutingModule { }

export const routedComponents = [
  AdmineditComponent
];