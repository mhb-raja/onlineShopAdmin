import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { LoginComponent } from './modules/user/login/login.component';


const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    loadChildren: () => import('src/app/layouts/default/default.module').then(m => m.DefaultModule)
  },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
