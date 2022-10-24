import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { concatMap, map } from 'rxjs/operators';
import { CategoryMiniDTO } from 'src/app/DTOs/category/CategoryDTO';
import { ProductDTO } from 'src/app/DTOs/product/ProductDTO';
import { ProductService } from 'src/app/services/product.service';
import { CropperDialogService } from 'src/app/shared/widgets/image-cropper/cropper-dialog.service';
import { ProductImagePath } from 'src/app/Utilities/PathTools';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss'],
})
export class ProductEditComponent implements OnInit {
  productId: number;
  dbData: ProductDTO = null;
  myForm: FormGroup = null;

  maxImageSize_kilos = 1000;
  maxLenText = 100;
  maxLenDescription = 2000;
  selectedCategory: CategoryMiniDTO = null;
  selectedImage = '';
  imagePath = ProductImagePath;
  aspectRatio = 1;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private cropperDialogService: CropperDialogService
  ) {}

  ngOnInit(): void {
    this.productId = parseInt(
      this.activatedRoute.snapshot.paramMap.get('id')!,
      10
    );

    this.productService.getProductForEdit(this.productId).subscribe((res) => {
      this.dbData = res;
      console.log(res);
      
      if (res) this.populateForm();
      //else this.goBack();
    });

    // this.activatedRoute.params.pipe(
    //   map((params)=>parseInt(params.id, 0)),
    //   concatMap(id => this.productService.getProductForEdit(id))
    // ).subscribe(res => {
    //   console.log(res);
    //   this.dbData = res;
    //   if (res)
    //     this.populateForm();
    //   else
    //     this.navigateUp();
    // });
  }

  goBack(): void {
    this.location.back();
  }

  populateForm() {
    this.myForm = new FormGroup({
      imageName: new FormControl(this.dbData.base64Image, [
        Validators.required,
      ]), // Validators.compose([Validators.required, MaxSizeValidator(this.maxImageSize_kilos * 10240)])],
      productName: new FormControl(this.dbData.productName, [
        Validators.required,
        Validators.maxLength(this.maxLenText),
      ]),
      description: new FormControl(this.dbData.description, [
        Validators.required,
        Validators.maxLength(this.maxLenDescription),
      ]),
      shortDescription: new FormControl(this.dbData.shortDescription, [
        Validators.required,
        Validators.maxLength(this.maxLenText),
      ]),
      price: new FormControl(this.dbData.price, [Validators.required]),
      isAvailable: new FormControl(this.dbData.isAvailable),
      urlCodeFa: new FormControl(this.dbData.urlCodeFa, [
        Validators.maxLength(this.maxLenText),
      ]),
      categoryId: new FormControl(this.dbData.categoryId, [
        Validators.required,
      ]),
    });
  }

  onSubmit(): void {
    if (!this.myForm.valid) this.myForm.markAsTouched();
    else {
      const data = this.createObject();
      this.sendEdit(data);
    }
  }

  createObject(): ProductDTO {
    console.log(this.myForm.controls.imageName.value);

    const prd: ProductDTO = {
      id: this.dbData.id,
      description: this.myForm.controls.description.value,
      shortDescription: this.myForm.controls.shortDescription.value,
      productName: this.myForm.controls.productName.value,
      base64Image: this.myForm.controls.imageName.value, // this.selectedImage,// ? this.selectedImage : this.productData.base64Image,
      urlCodeFa: this.myForm.controls.urlCodeFa.value,
      price: this.myForm.controls.price.value,
      isAvailable: this.myForm.controls.isAvailable.value,
      categoryId: this.selectedCategory
        ? this.selectedCategory.id
        : this.dbData.categoryId,
    };
    return prd;
  }

  sendEdit(data: ProductDTO) {
    this.productService.editProduct(data).subscribe((res) => {
      if (res) this.goBack();
    });
  }

  async openCropper() {
    const result = <string | null>(
      await this.cropperDialogService.open(this.aspectRatio)
    );
    if (result) {
      this.selectedImage = result;
      this.myForm.patchValue({
        imageName: result,
      });
    }
  }

  discardChangeImage() {
    this.selectedImage = null;
  }

  changeImage(event: any) {
    this.selectedImage = event;
    this.myForm.patchValue({ imageName: event });
  }
}
