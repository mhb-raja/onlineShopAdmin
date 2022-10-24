import { Component, Inject, OnInit } from '@angular/core';
import { 
  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { CropperDialogService } from './cropper-dialog.service';
import { ImageService } from './image.service';

export interface CropperData {
  aspectRatio: number;
  imageBase64:string;
}

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss'],  
})
export class ImageCropperComponent implements OnInit {
  myratio: number;
  imageChangedEvent: any = '';

  croppedImageData: any = '';
   croppedImageBase64 = '';
  /**
   * Image to be cropped as a base64 string.
   * Should be passed in from the component calling this modal.
   */
  //@Input() imageBase64 = '';

  constructor(
    //public dialogRef: MatDialogRef<ImageCropperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CropperData,
    private imageService:ImageService,
    private  cropperDialogService:CropperDialogService
  ) {}

  // constructor() {}

  ngOnInit(): void {
    this.myratio = this.data.aspectRatio;
  }

  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    //console.log('imagecropped', event);
    this.croppedImageData=event;
    this.croppedImageBase64 = event.base64;
  }

  submit(){
    this.cropperDialogService.submitDialog(this.croppedImageBase64);
    // this.dialogRef.close(this.croppedImageBase64);
  }
  dismiss(){
    this.cropperDialogService.dismissDialog();
    //this.dialogRef.close();
  }

  // processFile(event:Event){
  //   this.imageService.handleImageSelection(event)
  //   .subscribe(imageBase64 => {

  //     //this.croppedImage = event.base64;
  //      this.croppedImageData = event;
  //   });
  // }



  imageLoaded() {    //image: LoadedImage) {
    // show cropper
    console.log('image loaded');
  }

  cropperReady(Dimensions:any) {
    // cropper ready
    console.log('cropper ready',Dimensions);
  }

  loadImageFailed() {
    // show message
    console.log('load image failed');
  }
}
