import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryAddComponent } from './category-add/category-add.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { CategoryTableComponent } from './category-table/category-table.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';

const routes: Routes = [
  { path: '', component: CategoryTableComponent },
  { path: 'add', component: CategoryAddComponent },
  { path: 'edit/:id', component: CategoryEditComponent }
]

@NgModule({
  declarations: [
    CategoryAddComponent,
    CategoryEditComponent,
    CategoryTableComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    ReactiveFormsModule, FormsModule,
  ],
  exports: [RouterModule]
})
export class CategoriesModule { }
