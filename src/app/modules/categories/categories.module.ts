import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryAddComponent } from './category-add/category-add.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CategoryTreeComponent } from './category-tree/category-tree.component';
import { AttribSearchComponent } from './attrib-search/attrib-search.component';

const routes: Routes = [
  { path: '', component: CategoryTreeComponent },
  { path: 'add/:parentId', component: CategoryAddComponent },
  { path: 'edit/:id', component: CategoryEditComponent },
  {path:'tree',component:CategoryTreeComponent}
]

@NgModule({
  declarations: [
    CategoryAddComponent,
    CategoryEditComponent,
    CategoryTreeComponent,
    AttribSearchComponent
  ],
  imports: [
    //CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    
    //MaterialModule,
    //ReactiveFormsModule, FormsModule,
  ],
  exports: [RouterModule]
})
export class CategoriesModule { }
