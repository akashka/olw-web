import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditstudentComponent } from './editstudent.component';

const routes: Routes = [{
  path: '',
  component: EditstudentComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TablesRoutingModule { }

export const routedComponents = [
  EditstudentComponent
];