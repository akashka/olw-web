import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfirmstudentComponent } from './confirmstudent.component';

const routes: Routes = [{
  path: '',
  component: ConfirmstudentComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TablesRoutingModule { }

export const routedComponents = [
  ConfirmstudentComponent
];