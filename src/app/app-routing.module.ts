import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './modules/not-found/not-found.component';
import { LoginComponent } from './modules/user/login/login.component';
import { UserAuthGuard } from './Utilities/user-auth.guard';


const routes: Routes = [
  {
    path: '',
    //canActivateChild:[UserAuthGuard],
    loadChildren: () => import('src/app/layouts/default/default.module').then(m => m.DefaultModule)
  },
  { path: 'login', component: LoginComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
