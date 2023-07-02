import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttribAddComponent } from './attrib-add/attrib-add.component';
import { AttribEditComponent } from './attrib-edit/attrib-edit.component';
import { AttribTableComponent } from './attrib-table/attrib-table.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ValueTableComponent } from './value-table/value-table.component';
import { ValueAddComponent } from './value-add/value-add.component';
import { ValueEditComponent } from './value-edit/value-edit.component';
import { ValueEditInsideComponent } from './value-edit-inside/value-edit-inside.component';
import { CanDeactivateGuard } from 'src/app/Utilities/can-deactivate.guard';

const routes: Routes = [
  // { path: '', component: AttribTableComponent },
  // { path: 'add', component: AttribAddComponent },
  // { path: ':id', component: AttribEditComponent }, //'edit/:id'
  // { path: ':attribId/values/add', component: ValueAddComponent },
  // { path: ':attribId/values', component: ValueTableComponent },
  // { path: 'values/add', redirectTo:'0/values/add' , pathMatch: 'full' },
  // { path: ':attribId/values/:id', component: ValueEditComponent , canDeactivate:[CanDeactivateGuard] },

  { path: '', component: AttribTableComponent },
  { path: 'add', component: AttribAddComponent },
  { path: ':id', component: AttribEditComponent, canDeactivate:[CanDeactivateGuard],  data:{title:'ویرایش'} },
  { path: 'values/add', redirectTo:'0/values/add' , pathMatch: 'full' },
  { path: ':attribId/values', component: ValueTableComponent, 
      children: [
        { path: 'add', component: ValueAddComponent },        
        { path: ':id', component: ValueEditComponent , canDeactivate:[CanDeactivateGuard]},
      ] 
  },
  
  
];

@NgModule({
  declarations: [
    AttribAddComponent,
    AttribEditComponent,
    AttribTableComponent,
    ValueTableComponent,
    ValueAddComponent,
    ValueEditComponent,
    ValueEditInsideComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class AttribModule {}
