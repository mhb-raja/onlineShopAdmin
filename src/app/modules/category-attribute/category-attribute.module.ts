import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CategoryAttribListComponent } from './category-attrib-list/category-attrib-list.component';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  { path: ':catId', component: CategoryAttribListComponent },
]

@NgModule({
  declarations: [
    CategoryAttribListComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class CategoryAttributeModule { }
