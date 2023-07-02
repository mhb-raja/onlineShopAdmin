import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { ValueDatasourceDTO, ValueDTO } from 'src/app/DTOs/category/ValueDTO';
import { HelperService } from 'src/app/services/helper.service';
import { ProductService } from 'src/app/services/product.service';
import { componentDestroyed } from 'src/app/shared/functions/componentDestroyed';
import { ColumnDataType, filterType, IColumnDefinition } from 'src/app/shared/interfaces/IColumnFilter';
import { DialogService } from 'src/app/shared/widgets/general-dialog/dialog.service';
import { DialogData } from 'src/app/shared/widgets/general-dialog/general-dialog.component';
import { ConstMaxLengthText, DefaultPageSize, DefaultPageSizeOptions } from 'src/app/Utilities/Constants';
import { helper } from 'src/app/Utilities/Helpers';

@Component({
  selector: 'app-value-table',
  templateUrl: './value-table.component.html',
  styleUrls: ['./value-table.component.scss'],
})
export class ValueTableComponent implements OnInit, OnDestroy {
  items$: Observable<ValueDTO[]>;
  rowDelete$ = new Subject();
  columns: IColumnDefinition<ValueDTO>[];

  ctrl_title = new FormControl('');
  ctrl_type = new FormControl('');
  ctrl_startPrice = new FormControl('');
  ctrl_endPrice = new FormControl('');
  ctrl_category = new FormControl('');

  //------------------------------------------


  maxLenText = ConstMaxLengthText;
  defaultPageSize = DefaultPageSize;  

  rowEdit$ = new Subject();
  attribId: number;

  myDatasource: ValueDatasourceDTO = {
    items: null,
    pageSize: this.defaultPageSize,
    pageIndex: 0,
    totalItems: 0,
    attribId: 0,
    text: '',
    attribTitle: '',
    attribType: ''
  };

  isLoading: boolean = true;
  

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialogService:DialogService,
    private helperService:HelperService,
  ) { this.attribId = parseInt(this.activatedRoute.snapshot.paramMap.get('attribId')!); }

  ngOnDestroy(): void {}
  
  ngOnInit(): void {
    this.setupColumns();
    this.setupFormListeners();
    this.setupEventListeners();    
  }
  //-----------------------------------------------
  setupColumns() {
    this.columns = [
      {
        columnDef: 'id',
        header: 'id',        
        cellData_Type:ColumnDataType.text,
        cellData_text:(element)=>`${element.id}`,
      },
      {
        columnDef: 'title',
        header: 'عنوان',        
        sortEnabled: true,
        cellData_Type: ColumnDataType.text,
        cellData_text: (element) => `${element.title}`,
        filter: {
          type: filterType.input,
          details:[
            { label: 'عنوان', value: this.myDatasource.text, control: this.ctrl_title}
          ]
        },
      },
    ];
    //console.log(this.columns)
  }
  //-----------------------------------------------
  setupFormListeners() {
    console.log('setupFormListeners called')
    this.filterListener_title();
  }

  filterListener_title(){
    this.ctrl_title.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(componentDestroyed(this)),
      tap((x:string) => {
        this.myDatasource.text = x;
        this.buildQueryParams();
      })
    ).subscribe();
  }
//---------------------------------------------------
  setupEventListeners(){
    console.log('setupEventListeners called')
    this.activatedRoute.params.pipe(
      tap(params=>{console.log('params=',params); 
        if (params.foo){
          this.rowEdit$.next(); 
          this.router.navigate(['.',{}] , { relativeTo: this.activatedRoute });
          
        }}),
      takeUntil(componentDestroyed(this))
    ).subscribe();

    const queryParams$ = this.activatedRoute.queryParams.pipe(      
      tap(params => this.setDS(params) ));
      

    this.items$ = merge(queryParams$, this.rowDelete$, this.rowEdit$).pipe( //filterText$,filterType$, repeated calls to service for each obs 
      switchMap(() => this.productService.getFilteredAttribValues(this.myDatasource)),
      tap(res => { this.myDatasource = res; this.isLoading = false; }),
      map(ds => ds.items),
      takeUntil(componentDestroyed(this))
    ); 
  }
//---------------------------------------------
  setDS(params: Params) {
    console.log('query params=',params);
    this.myDatasource.pageIndex = params.page ? parseInt(params.page): 0;
    this.myDatasource.pageSize = params.pageSize ? parseInt(params.pageSize) : this.defaultPageSize;
    this.myDatasource.text = params.text;    
    this.myDatasource.attribId = this.attribId; //params.attribId ? parseInt(params.attribId) : null;
    helper.control_setValue(this.ctrl_title,this.myDatasource.text);
  }

  buildQueryParams() {
    let queryParams: any = {};
    //if (this.myDatasource.text) 
    queryParams.text = this.myDatasource.text;
    queryParams.page = this.myDatasource.pageIndex;
    queryParams.pageSize = this.myDatasource.pageSize;
    //queryParams.attribId=this.myDatasource.attribId;
    //queryParams.orderBy = this.myDatasource.orderBy;

    this.router.navigate([], { queryParams: queryParams });//relativeTo:this.activatedRoute,    
  }
//----------------------------------------
  pageChange(){
    console.log('change',this.myDatasource)
    this.buildQueryParams();
  }

  sortChange(sort: Sort) {
    console.log(
      `sort: avctive-${sort.active} direction-${sort.direction}`,
      sort
    );
    // this.myDatasource.sort = sort.direction;
    // this.buildQueryParams();
  }

  deleteRows(list:ValueDTO[]){
    console.log(list)
    this.productService.deleteAttribValueList(list.map(x=>x.id)).subscribe(()=>{
      this.rowDelete$.next();
    // this.snackBar.open( `ویژگی ${element.title} حذف شد`, 'OK', { duration: 5000 })
    })
  }
  
  //related to value-edit-inside-component
  editResult(result:boolean){
    //this.selectedElement = null;
    if(result)
      this.rowEdit$.next();
  }


}
