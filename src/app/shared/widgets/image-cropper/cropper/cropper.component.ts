import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CropperDialogService } from '../cropper-dialog.service';
import { CropperData } from '../image-cropper.component';
import { ImageService } from '../image.service';
import { Dimensions, ImageCroppedEvent, ImageTransform, base64ToFile } from 'ngx-image-cropper';

@Component({
  selector: 'app-cropper',
  templateUrl: './cropper.component.html',
  styleUrls: ['./cropper.component.scss']
})
export class CropperComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CropperData,
    private imageService:ImageService,
    private  cropperDialogService:CropperDialogService) { }

  myratio: number;
  imageChangedEvent: any = '';

  croppedImageData: any = '';
  croppedImageBase64 = '';

  //---------------------------------
  sourceImageDimensions=null;
  //--------------------
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};

  ngOnInit(): void {
    this.myratio = this.data.aspectRatio;
  }

  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    //console.log('imagecropped', event);
    this.croppedImageData = event;
    this.croppedImageBase64 = event.base64;

    this.croppedImage = event.base64;
    console.log(event, base64ToFile(event.base64));
  }

  submit(){
    this.cropperDialogService.submitDialog(this.croppedImageBase64);
    // this.dialogRef.close(this.croppedImageBase64);
  }
  dismiss(){
    this.cropperDialogService.dismissDialog();
    //this.dialogRef.close();
  }
//-------------------------

  imageLoaded() {
    this.showCropper = true;
    console.log('Image loaded');
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    this.sourceImageDimensions=sourceImageDimensions;
    console.log('Cropper ready', sourceImageDimensions);
  }

  loadImageFailed() {
    console.log('Load failed');
  }

  rotateLeft() {
      this.canvasRotation--;
      this.flipAfterRotate();
  }

  rotateRight() {
      this.canvasRotation++;
      this.flipAfterRotate();
  }

  private flipAfterRotate() {
      const flippedH = this.transform.flipH;
      const flippedV = this.transform.flipV;
      this.transform = {
          ...this.transform,
          flipH: flippedV,
          flipV: flippedH
      };
  }


  flipHorizontal() {
      this.transform = {
          ...this.transform,
          flipH: !this.transform.flipH
      };
  }

  flipVertical() {
      this.transform = {
          ...this.transform,
          flipV: !this.transform.flipV
      };
  }

  resetImage() {
      this.scale = 1;
      this.rotation = 0;
      this.canvasRotation = 0;
      this.transform = {};
  }

  zoomOut() {
      this.scale -= .1;
      this.transform = {
          ...this.transform,
          scale: this.scale
      };
  }

  zoomIn() {
      this.scale += .1;
      this.transform = {
          ...this.transform,
          scale: this.scale
      };
  }

  toggleContainWithinAspectRatio() {
      this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  updateRotation() {
      this.transform = {
          ...this.transform,
          rotate: this.rotation
      };
  }
}
