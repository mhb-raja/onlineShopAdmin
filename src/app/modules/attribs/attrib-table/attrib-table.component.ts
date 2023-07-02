import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, take, takeUntil, tap,} from 'rxjs/operators';

import { AttribDatasourceDTO, AttribDTO, AttribOrderBy,} from 'src/app/DTOs/category/AttribDTO';
import { ProductService } from 'src/app/services/product.service';
import { componentDestroyed } from 'src/app/shared/functions/componentDestroyed';
import { IKeyPair } from 'src/app/shared/interfaces/common';
import { ColumnDataType, filterType, IActionButton, IButtonsColumn, IColumnDefinition,} from 'src/app/shared/interfaces/IColumnFilter';
import { DefaultPageSize,} from 'src/app/Utilities/Constants';
import { helper } from 'src/app/Utilities/Helpers';

@Component({
  selector: 'app-attrib-table',
  templateUrl: './attrib-table.component.html',
  styleUrls: ['./attrib-table.component.scss'],
})
export class AttribTableComponent implements OnInit, OnDestroy {
  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  defaultPageSize = DefaultPageSize;
  //attribTypeListMap = new Map<number,string>();
  attribTypeList:IKeyPair<number,string>[]=[];
  items$: Observable<AttribDTO[]>;
  rowDelete$ = new Subject();

  myDatasource: AttribDatasourceDTO = {
    items: null,
    pageSize: this.defaultPageSize,
    pageIndex: 0,
    totalItems: 0,
    text: '',
    typeId: 0,
    orderBy: null,
  };

  ctrl_title = new FormControl('');
  ctrl_type = new FormControl('');

  isLoading: boolean = true;

  buttons: IButtonsColumn;
  singleBtnView: IActionButton;
  menuBtns: IActionButton[];

  columns: IColumnDefinition<AttribDTO>[];

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.getAttribTypes();
    this.setupColumns();
    this.setupActionButtons();
    this.setupEventListeners();
    this.setupFormListeners();    
  }

  //--------------------------------------
  setupFormListeners() {
    this.filterListener_title();
    this.filterListener_type();
  }

  filterListener_title(){
    this.ctrl_title.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(componentDestroyed(this)),
      tap((x: string) => {
        this.myDatasource.text = x;
        this.paramChangeNavigate({'text' : this.myDatasource.text? this.myDatasource.text : null})        
      })
    ).subscribe();
  }

  filterListener_type(){
    this.ctrl_type.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(componentDestroyed(this)),
      tap((x) => {
        this.myDatasource.typeId = x;
        this.paramChangeNavigate({'type' : this.myDatasource.typeId})        
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
//----------------------------------------
  setupEventListeners() {
    const queryParams$ = this.activatedRoute.queryParams.pipe(
      tap((params) => this.setDS(params))
    );

    this.items$ = merge(queryParams$, this.rowDelete$).pipe(      
      switchMap(() => this.productService.getFilteredAttributes(this.myDatasource)),
      tap((res) => {
        this.myDatasource = res;
        this.isLoading = false;
      }),
      map((ds) => ds.items),
      takeUntil(componentDestroyed(this))
    );
  }

  getAttribTypes() {
    this.productService.getAttribTypes().pipe(
      take(1),
      //map(list=> list.forEach(item => this.attribTypeListMap.set(item.id, item.title_Fa))) 
      map(list=> list.forEach(item=>this.attribTypeList.push({key:item.id,value: item.title_Fa}))),
      tap(x=>console.log(this.attribTypeList))
    ).subscribe();
  }
  //---------------------------------------------
  setupColumns() {
    this.columns = [
      {
        columnDef: 'id',
        header: 'id',
        cellData_Type: ColumnDataType.text,
        cellData_text: (element) => `${ element.id }`,
      },
      {
        columnDef: 'title',
        header: 'عنوان',
        cellData_Type: ColumnDataType.text,
        cellData_text: (element) => `${element.title}`,
        sortEnabled: true,
        filter: {
          type: filterType.input,
          details:[
            { label: 'عنوان', value: this.myDatasource.text, control: this.ctrl_title }
          ]
          
        },
      },
      {
        columnDef: 'valuesCount',
        header: 'مقدارها',
        sortEnabled: true,
        cellData_Type: ColumnDataType.text,
        cellData_text: (element) => `${element.valuesCount}`,
      },
      {
        columnDef: 'type',
        header: 'نوع',
        cellData_Type: ColumnDataType.text,
        cellData_text: (element) => `${element.type}`,
        sortEnabled: true,
        filter: {
          type: filterType.select,
          details:[
            { label: 'نوع', value: this.myDatasource.typeId, options: this.attribTypeList, //this.attribTypeList$,
              control: this.ctrl_type}
          ]
            
        },
      },
    ];
  }

  setupActionButtons() {
    this.singleBtnView={ action: 'values', icon: 'zoom_in', text: 'مشاهده مقدارها' };
    this.menuBtns=[{ action: '', icon: 'mode_edit', text: 'ویرایش' }];

    // this.buttons = {
    //   singleBtn: { action: 'values', icon: 'zoom_in', text: 'مشاهده مقدارها' },
    //   menu: [{ action: '', icon: 'mode_edit', text: 'ویرایش' }],
    // };
  }

  //-------------------------------------------------
  setDS(params: Params) {
    this.myDatasource.pageIndex = params.page ? parseInt(params.page, 0) : 0;
    this.myDatasource.pageSize = params.pageSize ? parseInt(params.pageSize, 0) : this.defaultPageSize;
    this.myDatasource.text = params.text;    
    this.myDatasource.typeId = params.type ? parseInt(params.type, 0) : 0;
    helper.control_setValue(this.ctrl_type,this.myDatasource.typeId);
    helper.control_setValue(this.ctrl_title,this.myDatasource.text);
  }
  //-----------------------------
  clearFilters(){    
    this.router.navigate([]); 
  }

  pageChange(){
    this.paramChangeNavigate({'pageIndex' : this.myDatasource.pageIndex , 'pageSize':this.myDatasource.pageSize} )  
  }

  sortChange(sort: Sort) {    
    this.myDatasource.orderBy = this.sortSwitch(sort);
    this.paramChangeNavigate({'orderBy' : this.myDatasource.orderBy } ) 
    //this.buildQueryParams();
  }

  sortSwitch(sort: Sort) : AttribOrderBy {
    if(sort.direction === '')
      return null;
    else
      switch (sort.active){
        case 'title':
          return (sort.direction==='asc' ? AttribOrderBy.TitleAsc : AttribOrderBy.TitleDesc);
        case 'type':
          return (sort.direction==='asc' ? AttribOrderBy.typeAsc : AttribOrderBy.typeDesc);
        case 'valuesCount':
          return (sort.direction==='asc' ? AttribOrderBy.valuesCountAsc : AttribOrderBy.valuesCountDesc);
        default:
          return null;
      }    
  }


  // buildQueryParams() {
  //   let queryParams: any = {};
  //   if (this.myDatasource.text) queryParams.text = this.myDatasource.text;
  //   if (this.myDatasource.typeId > 0)
  //     queryParams.type = this.myDatasource.typeId;
  //   queryParams.pageSize = this.myDatasource.pageSize;
  //   queryParams.page = this.myDatasource.pageIndex;
  //   if(this.myDatasource.orderBy) queryParams.sort = this.myDatasource.sort;
  //   this.router.navigate([], { queryParams: queryParams });
  // }

  deleteRows(list:AttribDTO[]){
    this.productService.deleteAttribList(list.map(x=>x.id)).subscribe(()=>{
      this.rowDelete$.next();
    // this.snackBar.open( `ویژگی ${element.title} حذف شد`, 'OK', { duration: 5000 })
    })
  }

}
