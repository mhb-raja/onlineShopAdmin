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

const routes: Routes = [
  { path: '', component: AttribTableComponent },
  { path: 'add', component: AttribAddComponent },
  { path: 'edit/:id', component: AttribEditComponent },  
  { path: ':attribId/values', component: ValueTableComponent },
  { path: ':attribId/values/add', component: ValueAddComponent },
  { path: 'values/add', redirectTo:'0/values/add' , pathMatch: 'full' },
  { path: ':attribId/values/edit/:id', component: ValueEditComponent },
];

@NgModule({
  declarations: [
    AttribAddComponent,
    AttribEditComponent,
    AttribTableComponent,
    ValueTableComponent,
    ValueAddComponent,
    ValueEditComponent,
  ],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class AttribModule {}
