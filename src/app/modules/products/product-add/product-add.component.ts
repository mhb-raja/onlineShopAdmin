import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ProductDTO } from 'src/app/DTOs/product/ProductDTO';
import { ProductService } from 'src/app/services/product.service';
import { CropperDialogService } from 'src/app/shared/widgets/image-cropper/cropper-dialog.service';
import { CropperData } from 'src/app/shared/widgets/image-cropper/image-cropper.component';
import { ImageService } from 'src/app/shared/widgets/image-cropper/image.service';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss'],
})
export class ProductAddComponent implements OnInit {
  aspectRatio: number = 2;

  maxImageSize_kilos = 1000;
  maxLenText = 100;
  maxLenDescription = 2000;
  selectedImage = '';

  constructor(
    private productService: ProductService,
    private router: Router,
    private imageService: ImageService,
    private cropperDialogService: CropperDialogService
  ) {}

  ngOnInit(): void {}

  myForm = new FormGroup({
    imageName: new FormControl(null, [Validators.required]), // Validators.compose([Validators.required, MaxSizeValidator(this.maxImageSize_kilos * 10240)])],
    productName: new FormControl(null, [
      Validators.required,
      Validators.maxLength(this.maxLenText),
    ]),
    description: new FormControl(null, [
      Validators.required,
      Validators.maxLength(this.maxLenDescription),
    ]),
    shortDescription: new FormControl(null, [
      Validators.required,
      Validators.maxLength(this.maxLenText),
    ]),
    price: new FormControl(null, [Validators.required]),
    isAvailable: new FormControl(false),
    urlCodeFa: new FormControl(null, [
      Validators.required,
      Validators.maxLength(this.maxLenText),
    ]),
    //'categoryId': new FormControl(null, [Validators.required])
  });

  onSubmit(): void {
    if (!this.myForm.valid) this.myForm.markAsTouched();
    else {
      const obj = this.createObject();
      this.sendNew(obj);
    }
  }

  createObject(): ProductDTO {
    const myData: ProductDTO = {
      id: 0,
      description: this.myForm.controls.description.value,
      shortDescription: this.myForm.controls.shortDescription.value,
      productName: this.myForm.controls.productName.value,
      base64Image: this.selectedImage,
      urlCodeFa: this.myForm.controls.urlCodeFa.value,
      price: this.myForm.controls.price.value,
      isAvailable: this.myForm.controls.isAvailable.value,
      categoryId: 2, //this.selectedCategory.id,
      //categoryTitle:'test'
    };
    console.log(
      'isAvailable',
      this.myForm.controls.isAvailable.value,
      this.myForm.controls.isAvailable
    );

    return myData;
  }

  sendNew(data: ProductDTO) {
    this.productService.addProduct(data).subscribe((res) => {
      if (res) this.router.navigate(['/products']); //this.myForm.reset();
    });
  }

  changeImage(event: any) {
    this.selectedImage = event;
    this.myForm.patchValue({
      imageName: event,
    });
    //console.log(this.myForm.controls.imageName.value);
  }

  processFile(event: Event) {
    this.imageService.handleImageSelection(event).subscribe((imageBase64) => {
      this.cropperDialogService
        .show(imageBase64)
        .then((result) => {
          console.log(result);

          // Do something with the result, upload to your server maybe?
        })
        .catch((error) => {
          // Handle any errors thrown
          console.log(error);
        });
    });
  }

  async openCropper() {
    const result = <string | null>(
      await this.cropperDialogService.open(this.aspectRatio)
    );

    this.selectedImage = result;
    this.myForm.patchValue({
      imageName: result,
    });
  }
}
