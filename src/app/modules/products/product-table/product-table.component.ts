import { formatNumber } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { productDatasourceDTO, ProductMiniDTO, ProductOrderBy } from 'src/app/DTOs/product/ProductDTO';
import { ProductService } from 'src/app/services/product.service';
import { componentDestroyed } from 'src/app/shared/functions/componentDestroyed';
import { ColumnDataType, filterType, IColumnDefinition } from 'src/app/shared/interfaces/IColumnFilter';
import { DefaultPageSize } from 'src/app/Utilities/Constants';
import { helper } from 'src/app/Utilities/Helpers';
import { ProductImagePath } from 'src/app/Utilities/PathTools';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss'],
})
export class ProductTableComponent implements OnInit, OnDestroy {

  items$: Observable<ProductMiniDTO[]>;
  rowDelete$ = new Subject();
  columns: IColumnDefinition<ProductMiniDTO>[];

  ctrl_productName = new FormControl('');
  ctrl_available = new FormControl('');
  ctrl_startPrice = new FormControl('');//, Validators.pattern('[0-9]*'));
  ctrl_endPrice = new FormControl('');
  ctrl_category = new FormControl('');

  imagePath = ProductImagePath;
  defaultPageSize = DefaultPageSize;
  
  myDatasource: productDatasourceDTO = {
    items: null,
    pageSize: this.defaultPageSize,
    pageIndex: 0,
    totalItems: 0,
    text: '',
    startPrice: null,
    endPrice: null,
    categories: [],
    orderBy: null,
    maxPrice: 0,
    availableOnly: null
  };

  isLoading: boolean = true;
 

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router,) { }

  ngOnDestroy(): void { }

  ngOnInit(): void {
    this.setupColumns();
    this.setupEventListeners();
    this.setupFormListeners();    
  } 

//----------------------------------------------------
  setupFormListeners() {
    this.filterListener_productName();
    this.filterListener_endPrice();
    this.filterListener_startPrice();
    this.filterListener_available();
  }

  filterListener_productName(){
    this.ctrl_productName.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(componentDestroyed(this)),
      tap((x:string) => {
        this.myDatasource.text = x;
        this.paramChangeNavigate({'text' : this.myDatasource.text? this.myDatasource.text : null})
      })
    ).subscribe();
  }

  filterListener_startPrice(){
    this.ctrl_startPrice.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(componentDestroyed(this)),
      tap((x:number) => {
        this.myDatasource.startPrice = x;
        this.paramChangeNavigate({'startPrice' : this.myDatasource.startPrice} )
      })
    ).subscribe();
  }

  filterListener_endPrice(){
    this.ctrl_endPrice.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(componentDestroyed(this)),
      tap((x:number) => {
        this.myDatasource.endPrice = x;
        this.paramChangeNavigate({'endPrice' : this.myDatasource.endPrice} )
      })
    ).subscribe();
  }

  filterListener_available(){
    this.ctrl_available.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(componentDestroyed(this)),
      tap((x:boolean) => {   
        this.myDatasource.availableOnly = x;// x ? x.toString() === 'true' : false;// (x && x==='true'?true:false);        
        this.paramChangeNavigate({'inStock' : this.myDatasource.availableOnly} ) 
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
  //--------------------------------------------------
  setupEventListeners() { 
    const queryParams$ = this.activatedRoute.queryParams.pipe(      
      tap((params) => this.setDS(params))
    );
    //this.items$ = scheduled([queryParams$, this.rowDelete$], scheduled).pipe(mergeAll())
    this.items$ = merge(queryParams$, this.rowDelete$).pipe(      
      switchMap(() => this.productService.getFilteredProducts(this.myDatasource)),//filterText$,filterType$, repeated calls to service for each obs
      tap((res) => {
        this.myDatasource = res;
        this.isLoading = false;
      }),
      map((ds) => ds.items),
      takeUntil(componentDestroyed(this))
    );
  }

  //-----------------------------
  setDS(params: Params) {
    this.myDatasource.pageIndex = params.pageIndex ? parseInt(params.pageIndex, 0) : 0;
    this.myDatasource.pageSize = params.pageSize ? parseInt(params.pageSize, 0): this.defaultPageSize;
    this.myDatasource.text = params.text;
    this.myDatasource.startPrice = params.startPrice;// ? parseInt(params.startPrice, 0) : 0;    
    this.myDatasource.endPrice = params.endPrice;// ? parseInt(params.endPrice, 0) : 0;//???????????
    this.myDatasource.orderBy = params.orderBy;
    this.myDatasource.availableOnly = helper.getBoolean( params.inStock); //params.inStock;
    console.log(this.myDatasource)
    helper.control_setValue(this.ctrl_startPrice,this.myDatasource.startPrice);
    helper.control_setValue(this.ctrl_endPrice,this.myDatasource.endPrice);
    helper.control_setValue(this.ctrl_available,this.myDatasource.availableOnly);
    helper.control_setValue(this.ctrl_productName,this.myDatasource.text);   
  }

  //-------------------------------------------------------
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
        cellData_img_src: (element) => this.imagePath +`${ element.base64Image}`,
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
        columnDef: 'urlCode',
        header: 'نام در url',        
        sortEnabled: true,
        cellData_Type: ColumnDataType.text,
        cellData_text: (element) => `${element.urlCodeFa}`,
        // filter: {
        //   type: filterType.input,
        //   details:[
        //     { label: 'نام محصول', value: this.myDatasource.text, control: this.ctrl_productName}
        //   ]
        // },
      },
      {
        columnDef: 'available',
        header: 'موجود',
        cellData_Type: ColumnDataType.boolean,
        cellData_bool_value: (element) => element.isAvailable,
        cellData_bool_False_class:'red',
        cellData_bool_True_class:'green',
        cellData_bool_True_icon:'check',
        cellData_bool_False_icon:'close',
        sortEnabled: true,
        filter: {
          type: filterType.select,
          details:[
            { control: this.ctrl_available, label:'',// 'موجودی', 
              value: this.myDatasource.availableOnly, 
               //list: new Map<number,string>().set(1,'فقط موجود').set(0,'فقط ناموجود')}]
               //list: new Map<boolean,string>().set(true,'فقط موجود').set(false,'فقط ناموجود')
               options: [
                { key: true, value: 'فقط موجود' },
                { key: false, value: 'فقط ناموجود' },
                // { key: 1, value: 'فقط موجود' },
                // { key: 0, value: 'فقط ناموجود' },
              ], 
            }]
        },
      },
      {
        columnDef: 'categoryTitle',
        header: 'دسته',        
        sortEnabled: true,
        cellData_Type: ColumnDataType.text,
        cellData_text: (element) => `${element.categoryTitle}`,
        // filter: {
        //   type: filterType.input,
        //   details:[
        //     { label: 'دسته', value: this.myDatasource.text, control: this.ctrl_productName}
        //   ]
        // },
      },
      {
        columnDef: 'price',
        header: 'قیمت',        
        cellData_Type: ColumnDataType.text,
        cellData_text:(element)=>`${formatNumber(element.price,'en-US','1.0-0')}`,
        filter:{
          type: filterType.input,
          details:[
            { label:'از', value: this.myDatasource.startPrice, control:this.ctrl_startPrice, valueType:'number'},
            { label:'تا', value: this.myDatasource.endPrice, control:this.ctrl_endPrice, valueType:'number'}
          ]
        }
      },
      
      // {
      //   columnDef: 'imageGallery',
      //   header: 'گالری',
      //   sortEnabled: true,      
      //   cellData_Type: ColumnDataType.button,
      //   cellData_btn_icon:'photo_library',      
      //   cellData_btn_link: (element) => `${"gallery/" + element.id}` 
      // },
      
    ];
    //console.log(this.columns)
  }
  //--------------------------------------------------
  deleteRows(list:ProductMiniDTO[]){
    console.log(list)
    this.productService.deleteProductList(list.map(x=>x.id)).subscribe(()=>{
      this.rowDelete$.next();
    // this.snackBar.open( `ویژگی ${element.title} حذف شد`, 'OK', { duration: 5000 })
    })
  }

  pageChange(){
    console.log('change',this.myDatasource)
    this.paramChangeNavigate({'pageIndex' : this.myDatasource.pageIndex , 'pageSize':this.myDatasource.pageSize} )  
  }

  sortChange(sort: Sort) {
    console.log(sort );
    this.myDatasource.orderBy = this.sortSwitch(sort);
    this.paramChangeNavigate({'orderBy' : this.myDatasource.orderBy } ) 
  }

  sortSwitch(sort: Sort) : ProductOrderBy {
    if(sort.direction === '')
      return null;
    else
      switch (sort.active){
        case 'productName':
          return (sort.direction ==='asc' ? ProductOrderBy.TitleAsc : ProductOrderBy.TitleDesc);
          
        case 'price':
          return (sort.direction==='asc' ? ProductOrderBy.PriceAsc : ProductOrderBy.PriceDesc);
        
        default:
          return null;
      }    
  }

  clearFilters(){    
    this.router.navigate([]); 
  }


}
