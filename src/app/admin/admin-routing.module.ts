import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesComponent } from '@app/admin/roles/roles.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';


const routes: Routes = [{
  path: '',
  children: [
    {
      path: 'roles',
      component: RolesComponent,
      canActivate: [AppRouteGuard],
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
