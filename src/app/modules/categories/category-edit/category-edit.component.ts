import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, Observable } from 'rxjs';
import { exhaustMap, takeUntil, throttleTime } from 'rxjs/operators';
import { CategoryDTO } from 'src/app/DTOs/category/CategoryDTO';
import { ProductService } from 'src/app/services/product.service';
import { categoryParentValidator } from 'src/app/shared/directives/category-parent-validator.directive';
import { componentDestroyed } from 'src/app/shared/functions/componentDestroyed';
import { ConstMaxLengthText } from 'src/app/Utilities/Constants';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss']
})
export class CategoryEditComponent implements OnInit, OnDestroy, AfterViewInit {

  maxLenText = ConstMaxLengthText;
  myForm: FormGroup = null;  
  dbData:CategoryDTO;
  categoryId:number;    

  constructor(private productService: ProductService,
    private activatedRoute: ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
    this.categoryId = parseInt(this.activatedRoute.snapshot.paramMap.get('id')!);
    this.getDetail(this.categoryId);
  }

  ngAfterViewInit(): void {   
    this.setupEventListeners();
  }

  ngOnDestroy(): void { }

  private setupEventListeners() {
    const btnSubmit = document.getElementById('btnSubmit');
    fromEvent(btnSubmit,'click').pipe(
      throttleTime(1000),
      exhaustMap(()=>this.sendObject(this.createObject())),
      takeUntil(componentDestroyed(this))
    ).subscribe(res=>
      {if(res)
        this.router.navigate(["../.."], {relativeTo: this.activatedRoute})
      }
    );
  }

  getDetail(id:number){
    this.productService.getCategoryDetail(this.categoryId).subscribe(res=>{
      this.dbData=res;
      if(res) this.populateForm();
      console.log(this.myForm)
    });
  }
  
  populateForm() {
    this.myForm = new FormGroup({
      title: new FormControl(this.dbData.title, [Validators.required, Validators.maxLength(this.maxLenText)]),
      urlTitle: new FormControl(this.dbData.urlTitle, [Validators.required, Validators.maxLength(this.maxLenText)]),
      parentId: new FormControl(this.dbData.parentId,[categoryParentValidator])
    }); 
  }

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
    if (!this.myForm.valid ) this.myForm.markAsTouched();//|| this.parentId.value < 0
  }

  createObject(): CategoryDTO {    
    const myData: CategoryDTO = {
      id: this.dbData.id,
      title:this.myForm.controls.title.value,
      parentId: this.myForm.controls.parentId.value,
      urlTitle:this.myForm.controls.urlTitle.value
    };
    return myData;
  }

  sendObject(data: CategoryDTO): Observable<boolean> { 
    return this.productService.editCategory(data).pipe(
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
