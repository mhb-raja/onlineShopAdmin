import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, tap, takeUntil, switchMap, exhaustMap, debounceTime } from 'rxjs/operators';
import { CategoryDTO, CategoryMiniDTO } from 'src/app/DTOs/category/CategoryDTO';
import { HelperService } from 'src/app/services/helper.service';
import { ProductService } from 'src/app/services/product.service';
import { componentDestroyed } from 'src/app/shared/functions/componentDestroyed';

export interface CategoryDialogData {
  parentId: number;
  parentTitle: string;
}

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.scss']
})
export class CategoryAddComponent implements OnInit,OnDestroy {

  maxLenTitle = 100;
  parentId: number;
  parentId$: Observable<number>;  
  path$: Observable<CategoryMiniDTO[]>;
  addedCategory$:Observable<CategoryDTO>;
  addedCatId:number;
  children$:Observable<CategoryDTO[]>;

  resultMessage: string = '';
  submitClicks$=new Subject();

  constructor(private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private helperService:HelperService
    //public dialogRef: MatDialogRef<CategoryAddComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: CategoryDialogData
    ) { }

  ngOnDestroy(): void { }

  ngOnInit(): void {
    this.parentId$ = this.activatedRoute.paramMap.pipe(
      map((params) => parseInt(params.get('parentId')!)),
      tap((id) => (this.parentId = id)),
      takeUntil(componentDestroyed(this))
    );

    this.path$ = this.parentId$.pipe(
      switchMap(id=>this.productService.getCategoryPath(id)),      
      takeUntil(componentDestroyed(this))      
    );

    this.addedCategory$ = this.submitClicks$.pipe(
      debounceTime(400),
      exhaustMap(()=>this.sendNew(this.createObject()))      
    );

    this.children$ = this.parentId$.pipe(
      switchMap(id=>this.productService.GetCategoryChildren(this.parentId)),
      takeUntil(componentDestroyed(this))
    );     
  }

  myForm = new FormGroup({
    'title': new FormControl(null, [Validators.required, Validators.maxLength(this.maxLenTitle)]),
    'urlTitle': new FormControl(null, [Validators.required, Validators.maxLength(this.maxLenTitle)])
  });

  onSubmit(): void {
    if (!this.myForm.valid)
      this.myForm.markAsTouched();
    else {
      this.submitClicks$.next();
      // const ctg = this.createObject();
      // this.sendNew(ctg);
    }
  }
  
  createObject(): CategoryDTO {
    const ctg: CategoryDTO = {
      id: 0,
      parentId: this.parentId,
      urlTitle: this.myForm.controls.urlTitle.value,
      title: this.myForm.controls.title.value
    };
    return ctg;
  }

  sendNew(ctg: CategoryDTO): Observable<CategoryDTO> { 
    return this.productService.addCategory_returnId(ctg).pipe(
      tap(newItem=>{
        this.addedCatId = newItem.id;
        const message=//'زیرشاخه "' + newItem.title + '" به شاخه "' + newItem..parentTitle + '" اضافه شد';
                'دسته newItem.title ایجاد شد';
        this.helperService.showSnackbar(message);
      }),
      takeUntil(componentDestroyed(this))
    );

  }
}



