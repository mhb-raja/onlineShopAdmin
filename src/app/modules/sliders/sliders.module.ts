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
  { path: 'edit/:id', component: SliderEditComponent }
]

@NgModule({
  declarations: [
    SliderTableComponent,
    SliderAddComponent,
    SliderEditComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    ReactiveFormsModule, FormsModule,
    NgPersianDatepickerModule,
    SharedModule
  ],
  exports: [RouterModule]
})
export class SlidersModule { }
