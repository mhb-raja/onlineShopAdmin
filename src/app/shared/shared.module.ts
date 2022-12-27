import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagePickerComponent } from './widgets/image-picker/image-picker.component';
import { MaterialModule } from '../material/material.module';
import { MessageModule } from './widgets/message/message.module';
import { GeneralDialogComponent } from './widgets/general-dialog/general-dialog.component';
import { ImageCropperComponent } from './widgets/image-cropper/image-cropper.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ImagePickerComponent,
    GeneralDialogComponent,
    //ImageCropperComponent,
  ],
  imports: [
    CommonModule,

FormsModule,ReactiveFormsModule, //2022-12-10 00:28

    MaterialModule,
    MessageModule,
    //ImageCropperModule,
    
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    
    ImagePickerComponent,
    // ImageCropperComponent
    MaterialModule,
    
  ]
})
export class SharedModule { }
