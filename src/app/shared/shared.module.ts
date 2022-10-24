import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagePickerComponent } from './widgets/image-picker/image-picker.component';
import { MaterialModule } from '../material/material.module';
import { MessageModule } from './widgets/message/message.module';
import { GeneralDialogComponent } from './widgets/general-dialog/general-dialog.component';
import { ImageCropperComponent } from './widgets/image-cropper/image-cropper.component';
import { ImageCropperModule } from 'ngx-image-cropper';


@NgModule({
  declarations: [
    ImagePickerComponent,
    GeneralDialogComponent,
    //ImageCropperComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MessageModule,
    //ImageCropperModule,
    
  ],
  exports: [
    ImagePickerComponent,
    // ImageCropperComponent
  ]
})
export class SharedModule { }
