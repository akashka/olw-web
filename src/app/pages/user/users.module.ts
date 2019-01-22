import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { TablesRoutingModule, routedComponents } from './users-routing.module';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  declarations: [
    ...routedComponents,
  ],
  imports: [
    ThemeModule,
    TablesRoutingModule,
    Ng2SmartTableModule,
  ],
})
export class UserPageModule {}