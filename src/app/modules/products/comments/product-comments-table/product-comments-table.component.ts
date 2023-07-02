import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';

import { ActivatedRoute, Router, Params } from '@angular/router';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ProductCommentDatasource, ProductCommentForAdminDTO, ProductCommentOrderBy } from 'src/app/DTOs/product/ProductCommentDTO';

import { ProductService } from 'src/app/services/product.service';
import { componentDestroyed } from 'src/app/shared/functions/componentDestroyed';
import { ColumnDataType, filterType, IColumnDefinition, IRowClass } from 'src/app/shared/interfaces/IColumnFilter';
import { DefaultPageSize } from 'src/app/Utilities/Constants';
import { helper } from 'src/app/Utilities/Helpers';
import { ProductImagePath } from 'src/app/Utilities/PathTools';

@Component({
  selector: 'app-product-comments-table',
  templateUrl: './product-comments-table.component.html',
  styleUrls: ['./product-comments-table.component.scss'],
})
export class ProductCommentsTableComponent implements OnInit, OnDestroy {

  toppings = new FormControl('');

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  items$: Observable<ProductCommentForAdminDTO[]>;
  rowDelete$ = new Subject();
  columns: IColumnDefinition<ProductCommentForAdminDTO>[];

  rowClass2: IRowClass<ProductCommentForAdminDTO>;
  rowClass: (T:ProductCommentForAdminDTO) => string;

  ctrl_productName = new FormControl('');
  ctrl_commentText = new FormControl('');
  ctrl_commentDate = new FormControl('');
  ctrl_seen:FormControl = new FormControl('');
  ctrl_approved = new FormControl('');
  
  isLoading: boolean = true;
  imagePath = ProductImagePath;
  
  myDatasource: ProductCommentDatasource = {
    items: null,
    pageSize: DefaultPageSize,
    pageIndex: 0,
    totalItems: 0,
    text: '',
    productId: null,
    seenOnly: null,
    productName:'',
    approvedOnly: null
  };

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.setupRowClass();
    this.setupColumns();
    this.setupEventListeners();
    this.setupFormListeners();
    
  }
  //-----------------------------------------------------
  setupRowClass(){
  this.rowClass=(element:ProductCommentForAdminDTO)=> element.seenByAdmin? 'read-grayBg' : 'unread' ;

    this.rowClass2={myclass:(element)=>element.seenByAdmin?'read-grayBg':'unread'};

  }
  setupColumns() {
    this.columns = [
      {
        columnDef: 'id',
        header: 'id',        
        cellData_Type: ColumnDataType.text,
        cellData_text: (element)=>`${element.id}`,
      },
      {
        columnDef: 'imageName',
        header: 'تصویر',
        cellData_Type: ColumnDataType.image,
        cellData_img_src: (element) => this.imagePath +`${ element.productImage}`,
        cellData_img_class: "element-thumbnail-container",
        cellData_img_alt: (element) => 'alt' //?????????????????? next:add both server and here
        
      },
      {
        columnDef: 'productName',
        header: 'نام محصول',        
        sortEnabled: true,
        cellData_Type: ColumnDataType.text,
        cellData_text: (element) => `${element.productName}`,
        filter: {
          type: filterType.input,
          details:[
            { label: 'نام محصول', value: this.myDatasource.text, control: this.ctrl_productName}
          ]
        },
      },
      {
        columnDef: 'commentText',
        header: 'متن نظر',
        sortEnabled: true,
        cellData_Type: ColumnDataType.text,
        cellData_text: (element) => `${element.text}`,
        filter: {
          type: filterType.input,
          details:[
            { label: 'متن نظر', value: this.myDatasource.text, control: this.ctrl_commentText}
          ]
        },
      },
      {
        columnDef: 'commentDate',
        header: 'تاریخ نظر',
        sortEnabled: true,
        cellData_Type: ColumnDataType.text,
        cellData_text: (element) => `${ helper.getPersianDate(element.date)}`,
        // filter: {
        //   type: filterType.input,
        //   details:[
        //     { label: 'تاریخ نظر', value: this.myDatasource., control: this.ctrl_commentDate}
        //   ]
        // },
      },
      {
        columnDef: 'approved',
        header: 'تایید شده',
        cellData_Type: ColumnDataType.boolean,
        cellData_bool_value: (element) => element.approved,
        cellData_bool_False_class:'redish',
        cellData_bool_True_class:'green',
        cellData_bool_True_icon:'done_outline',//library_add_check
        cellData_bool_False_icon:'unpublished',
        sortEnabled: true,
        filter: {
          type: filterType.select,
          details:[
            { label: 'فیلتر', value: this.myDatasource.approvedOnly, control: this.ctrl_approved,               
              options: [
                { key: true, value: 'فقط تایید شده' },
                { key: false, value: 'فقط تایید نشده' },
              ],
               //list: new Map<boolean,string>().set(true,'فقط تایید شده').set(false,'فقط تایید نشده')
            }
          ]
              
        },
      },
      {
        columnDef: 'seen',
        header: 'دیده شده',
        cellData_Type: ColumnDataType.boolean,
        cellData_bool_value: (element) => element.seenByAdmin,
        // cellData_bool_False_class:'red',
        // cellData_bool_True_class:'green',
        cellData_bool_True_icon:'mark_chat_read',
        cellData_bool_False_icon:'mark_chat_unread',
        sortEnabled: true,
        filter: {
          type: filterType.select,
          details:[
            { label: '', value: this.myDatasource.seenOnly, control: this.ctrl_seen,
              options: [
                { key: true, value: 'فقط دیده شده' },
                { key: false, value: 'فقط دیده نشده' },
              ],   
              //list: new Map<boolean,string>().set(true,'فقط دیده شده').set(false,'فقط دیده نشده')}]
            }
          ]
        },
      },
      

    ];
    //console.log(this.columns)
  }
  //-----------------------------------------------------
  //#region  form listeners
  setupFormListeners() {
    this.filterListener_productName();
    this.filterListener_approved();
    this.filterListener_commentText();
    this.filterListener_seen();
  }

  filterListener_productName(){
    this.ctrl_productName.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(componentDestroyed(this)),
      tap((x:string) => {
        this.myDatasource.productName = x;
        this.paramChangeNavigate({'productName' : this.myDatasource.productName? this.myDatasource.productName : null})
      })
    ).subscribe();
  }

filterListener_commentText(){
  this.ctrl_commentText.valueChanges.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    takeUntil(componentDestroyed(this)),
    tap((x:string) => {
      this.myDatasource.text = x;
      this.paramChangeNavigate({'text' : this.myDatasource.text? this.myDatasource.text : null});
    })
  ).subscribe();
}

filterListener_approved(){
  this.ctrl_approved.valueChanges.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    takeUntil(componentDestroyed(this)),
    tap((x:boolean) => {
      console.log(x)
      this.myDatasource.approvedOnly = x;
      this.paramChangeNavigate({'approvedOnly': this.myDatasource.approvedOnly});
    })
  ).subscribe();
}

  filterListener_seen(){
    this.ctrl_seen.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(componentDestroyed(this)),
      tap((x:boolean) => {   
        this.myDatasource.seenOnly = x;
        this.paramChangeNavigate({'seenOnly' : this.myDatasource.seenOnly} )  
      })
    ).subscribe();
  }

  paramChangeNavigate(queryParams){
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: queryParams,//{ paramKey : paramValue}, 
      queryParamsHandling: 'merge', // remove to replace all query params by provided
    });
  }

  //#endregion
  //-----------------------------------------------------

  //-----------------------------------------------------
  setupEventListeners() { 
    const queryParams$ = this.activatedRoute.queryParams.pipe(    
      tap((params) => this.setDS(params))
    );
    
    this.items$ = merge(queryParams$, this.rowDelete$).pipe(      
      switchMap(() => this.productService.getFilteredComments(this.myDatasource)),      
      tap((res) => {
        this.myDatasource = res;
        this.isLoading = false;
      }),
      map((ds) => ds.items),
      takeUntil(componentDestroyed(this))
    );
  }  
  //-----------------------------------------------------
  setDS(params: Params) {
    
    this.myDatasource.pageIndex = params.pageIndex? parseInt(params.pageIndex, 0) : 0;
    this.myDatasource.pageSize = params.pageSize ? parseInt(params.pageSize, 0) : DefaultPageSize;
    this.myDatasource.text = params.text;
    this.myDatasource.productId = params.productId; 
    this.myDatasource.seenOnly = helper.getBoolean(params.seenOnly);// params.seenOnly; //? params.seenOnly: false;
    this.myDatasource.approvedOnly = helper.getBoolean(params.approvedOnly);// params.approvedOnly;
    this.myDatasource.productName = params.productName;

    helper.control_setValue(this.ctrl_productName, this.myDatasource.productName);    
    helper.control_setValue(this.ctrl_approved, this.myDatasource.approvedOnly);     
    helper.control_setValue(this.ctrl_commentText, this.myDatasource.text); 
    helper.control_setValue(this.ctrl_seen, this.myDatasource.seenOnly); 
  }
  
  //---------------------------------------
  clearFilters(){    
    this.router.navigate([]); 
  }

  deleteRows(list:ProductCommentForAdminDTO[]){
    console.log(list)
    // this.productService.deleteProductList(list.map(x=>x.id)).subscribe(()=>{
    //   this.rowDelete$.next();
    // // this.snackBar.open( `ویژگی ${element.title} حذف شد`, 'OK', { duration: 5000 })
    // })
  }

  pageChange(){
    this.paramChangeNavigate({'pageIndex' : this.myDatasource.pageIndex , 'pageSize':this.myDatasource.pageSize} )  
  }

  sortChange(sort: Sort) {
    console.log(sort );
    this.myDatasource.orderBy = this.sortSwitch(sort);
    this.paramChangeNavigate({'orderBy' : this.myDatasource.orderBy } ) 
  }

  sortSwitch(sort: Sort) : ProductCommentOrderBy {
    if(sort.direction === '')
      return null;
    else
      switch (sort.active){
        case 'productName':
          return (sort.direction ==='asc' ? ProductCommentOrderBy.ProductNameAsc : ProductCommentOrderBy.ProductNameDesc);          
        case 'commentDate':
          return (sort.direction==='asc' ? ProductCommentOrderBy.DateAsc : ProductCommentOrderBy.DateDesc);
        case 'price':
          return (sort.direction==='asc' ? ProductCommentOrderBy.UsernameAsc : ProductCommentOrderBy.UsernameDesc);  
        default:
          return null;
      }    
  }

}
