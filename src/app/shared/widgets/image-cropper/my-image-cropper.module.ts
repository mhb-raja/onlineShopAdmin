import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageService } from './image.service';
import { CropperDialogService } from './cropper-dialog.service';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageCropperComponent } from './image-cropper.component';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  declarations: [ImageCropperComponent],
  imports: [CommonModule, ImageCropperModule,MaterialModule],
  providers: [ImageService, CropperDialogService],
  exports: [],
})
export class MyImageCropperModule {}
