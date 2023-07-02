import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fromEvent, Observable } from 'rxjs';
import { tap, takeUntil, exhaustMap, throttleTime } from 'rxjs/operators';
import { CategoryDTO } from 'src/app/DTOs/category/CategoryDTO';
import { HelperService } from 'src/app/services/helper.service';
import { ProductService } from 'src/app/services/product.service';
import { categoryParentValidator } from 'src/app/shared/directives/category-parent-validator.directive';
import { componentDestroyed } from 'src/app/shared/functions/componentDestroyed';
import { ConstMaxLengthText } from 'src/app/Utilities/Constants';


@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.scss']
})
export class CategoryAddComponent implements OnDestroy, AfterViewInit {

  maxLenText = ConstMaxLengthText;
  // addedCategory$:Observable<CategoryDTO>;
  // addedCatId:number;

  constructor(private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private helperService:HelperService  ) { }
 
  
  ngOnDestroy(): void { }
  
  ngAfterViewInit(): void {
    this.setupEventListeners();
  }

  private setupEventListeners() {    
    const btnSubmit = document.getElementById('btnSubmit');
    fromEvent(btnSubmit,'click').pipe(
      throttleTime(1000),
      exhaustMap(()=>this.sendObject(this.createObject())),
      takeUntil(componentDestroyed(this))
    ).subscribe();
  }
  
  myForm = new FormGroup({
    title: new FormControl(null, [Validators.required, Validators.maxLength(this.maxLenText)]),
    urlTitle: new FormControl(null, [Validators.required, Validators.maxLength(this.maxLenText)]),
    parentId:new FormControl(-1, [categoryParentValidator])
  });

  get title() {    
    return this.myForm.get('title');
  }
  get urlTitle() {
    return this.myForm.get('urlTitle');
  }
  get parentId(){
    return this.myForm.get('parentId');
  }

  onSubmit(): void {
    if (!this.myForm.valid)
      this.myForm.markAsTouched();
  }
  
  createObject(): CategoryDTO {
    console.log(this.myForm.controls)
    const obj: CategoryDTO = {
      id: 0,
      parentId:this.myForm.controls.parentId.value,
      urlTitle: this.myForm.controls.urlTitle.value,
      title: this.myForm.controls.title.value
    };
    return obj;
  }

  sendObject(ctg: CategoryDTO): Observable<CategoryDTO> { 
    return this.productService.addCategory_returnId(ctg).pipe(
      tap(newItem=>{
        if(newItem){
          this.myForm.reset();
          //this.addedCatId = newItem.id;
          const message=//'زیرشاخه "' + newItem.title + '" به شاخه "' + newItem..parentTitle + '" اضافه شد';
                `دسته ${newItem.title} ایجاد شد`;
          this.helperService.showSnackbar(message);
        }
      }),
      takeUntil(componentDestroyed(this))
    );
  }
  
  /**
   * gets called whenever the tree emits a selection-change event
   * If receive a string 'root', parentId equals to -1. to represent root
   * If receive null, it means user has unchecked the root or some node checkbox
   * @param category 
   */
  setParentId (category:number) {  
    this.myForm.patchValue ({      
      parentId: category
    });  
  }
}



