import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PromotestudentComponent } from './promotestudent.component';

const routes: Routes = [{
  path: '',
  component: PromotestudentComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TablesRoutingModule { }

export const routedComponents = [
  PromotestudentComponent
];