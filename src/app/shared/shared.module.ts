import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagePickerComponent } from './widgets/image-picker/image-picker.component';
import { MaterialModule } from '../material/material.module';
import { MessageModule } from './widgets/message/message.module';
import { GeneralDialogComponent } from './widgets/general-dialog/general-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputFormfieldComponent } from './widgets/input-formfield/input-formfield.component';
import { RouterModule } from '@angular/router';
import { SelectFormfieldComponent } from './widgets/select-formfield/select-formfield.component';
import { TableComponent } from './widgets/table-wrapper/table/table.component';
import { ListFormfieldComponent } from './widgets/list-formfield/list-formfield.component';
import { PersianDatepickerFormfieldComponent } from './widgets/persian-datepicker-formfield/persian-datepicker-formfield.component';
import { NgPersianDatepickerModule } from 'ng-persian-datepicker';


@NgModule({
  declarations: [
    ImagePickerComponent,
    GeneralDialogComponent,
    InputFormfieldComponent,
    SelectFormfieldComponent,

    TableComponent,
     ListFormfieldComponent,
     PersianDatepickerFormfieldComponent, //ColumnFilterComponent
    //ImageCropperComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, //2022-12-10 00:28

    RouterModule,
    NgPersianDatepickerModule,
    MaterialModule,
    MessageModule,
    //ImageCropperModule,

  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    
    ImagePickerComponent,

    InputFormfieldComponent,
    SelectFormfieldComponent,
    PersianDatepickerFormfieldComponent,
    TableComponent,

    // ImageCropperComponent
    MaterialModule,
    
  ]
})
export class SharedModule { }
