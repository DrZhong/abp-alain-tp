import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AbpModule } from 'abp-ng2-module/dist/src/abp.module';
import { RolesComponent } from './roles/roles.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    AbpModule
  ],
  declarations: [RolesComponent]
})
export class AdminModule { }
