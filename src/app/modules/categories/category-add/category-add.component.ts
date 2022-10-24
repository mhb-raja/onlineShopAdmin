import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryDTO } from 'src/app/DTOs/category/CategoryDTO';
import { ProductService } from 'src/app/services/product.service';

export interface CategoryDialogData {
  parentId: number;
  parentTitle: string;
}

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.scss']
})
export class CategoryAddComponent implements OnInit {

  maxLenTitle = 100;
  resultMessage: string = '';

  constructor(private productService: ProductService,
    public dialogRef: MatDialogRef<CategoryAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryDialogData) { }

  ngOnInit(): void {
  }

  ctgForm = new FormGroup({
    'title': new FormControl(null, [Validators.required, Validators.maxLength(this.maxLenTitle)]),
    'urlTitle': new FormControl(null, [Validators.required, Validators.maxLength(this.maxLenTitle)])
  });

  onSubmit(): void {

    if (!this.ctgForm.valid)
      this.ctgForm.markAsTouched();
    else {
      const ctg = this.createObject();
      this.sendNew(ctg);
    }
  }

  createObject(): CategoryDTO {
    const ctg: CategoryDTO = {
      id: 0,
      parentId: this.data.parentId,
      urlTitle: this.ctgForm.controls.urlTitle.value,
      title: this.ctgForm.controls.title.value
    };
    return ctg;
  }

  sendNew(ctg: CategoryDTO) {
    this.productService.addCategory(ctg).subscribe(res => {
      if (res) {
        this.resultMessage = 'زیرشاخه "' + ctg.title + '" به شاخه "' + this.data.parentTitle + '" اضافه شد';
      }
      // else if (res.eStatus === Status.Error)
      //   this.resultMessage = res.message;
      // this.dialogRef.close(this.resultMessage);
    });
  }

  discard(): void {
    this.dialogRef.close();
  }
}



