import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderTableComponent } from './slider-table/slider-table.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SliderAddComponent } from './slider-add/slider-add.component';
import { SliderEditComponent } from './slider-edit/slider-edit.component';
import { NgPersianDatepickerModule } from 'ng-persian-datepicker';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  { path: '', component: SliderTableComponent },
  { path: 'add', component: SliderAddComponent },
  { path: ':id', component: SliderEditComponent }
]

@NgModule({
  declarations: [
    SliderTableComponent,
    SliderAddComponent,
    SliderEditComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    NgPersianDatepickerModule,
    
  ],
  exports: [RouterModule]
})
export class SlidersModule { }
