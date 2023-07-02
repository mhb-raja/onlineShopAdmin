import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class CropperDialogService {

  dialogRef:any=null;

  constructor(public dialog: MatDialog) {}

  async show(imageBase64: string): Promise<string | null> {
    // Lazy load the image crop modal (an Angular Ivy feature)
    const { ImageCropperComponent } = await import(`./image-cropper.component`);

    const dialogRef = await this.dialog.open(ImageCropperComponent, {
      width: '900px',
      data: { aspectRatio: 1.3, imageBase64: imageBase64 },
    });
    let result = null;
    await dialogRef.afterClosed().subscribe((res) => {
      console.log('dialog-afterclosed',res);
      return res;
      // if (result !== undefined && result !== '')
      //   this.snackBar.open(result, 'OK', { duration: 5000 });
    });
    
    return result;
    // const modal: HTMLIonModalElement = await this.modalController.create({
    //   component: ImageCropModalComponent,
    //   componentProps: {
    //     imageBase64
    //   },
    // });

    // await modal.present();

    // const result = await modal.onWillDismiss();

    // if (result.data && result.data.croppedImageBase64) {
    //   return result.data.croppedImageBase64;
    // } else {
    //   return null;
    // }
  }

  async open(ratio:number): Promise<string | null>{
    // Lazy load the image crop modal (an Angular Ivy feature)
    const { ImageCropperComponent } = await import(`./image-cropper.component`);
    /**
     * let config = new MatDialogConfig();
    config = {
      position: {
        top: '10px',
        right: '10px'
      },
      height: '98%',
      width: '100vw',
      panelClass: 'full-screen-modal',
    };
     */
    

    this.dialogRef = await this.dialog.open(ImageCropperComponent, {
      //width: '850px',
      maxWidth: '98vw',
      maxHeight: '98vh',
      height: '100%',
      width: '100%',
      data: { aspectRatio: ratio, imageBase64: null },
    });    
    return await this.dialogRef.afterClosed().toPromise();
  }

  async open2(ratio:number): Promise<string | null>{
    // Lazy load the image crop modal (an Angular Ivy feature)
    const { CropperComponent } = await import(`./cropper/cropper.component`);

    this.dialogRef = await this.dialog.open(CropperComponent, {
      //width: '850px',
      maxWidth: '98vw',
      maxHeight: '98vh',
      height: '100%',
      width: '100%',
      data: { aspectRatio: ratio, imageBase64: null },
    });    
    return await this.dialogRef.afterClosed().toPromise();
  }

  async submitDialog(croppedImageBase64){
    await this.dialogRef.close(croppedImageBase64 );
  }

  async dismissDialog(){    
    await this.dialogRef.close();
  }



  
}
