import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './category.component';
import { CategoryService } from './category.service';
import { MaterialModule } from 'src/app/material/material.module';



@NgModule({
  declarations: [
    CategoryComponent
  ],
  imports: [
    CommonModule,
    MaterialModule    
  ],
  providers:[
    CategoryService
  ]
})
export class CategoryModule { }
