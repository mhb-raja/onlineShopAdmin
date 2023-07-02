import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { sliderDatasourceDTO, SliderOrderBy } from 'src/app/DTOs/slider/sliderDatasourceDTO';
import { SliderDTO } from 'src/app/DTOs/slider/SliderDTO';
import { HelperService } from 'src/app/services/helper.service';
import { SliderService } from 'src/app/services/slider.service';
import { componentDestroyed } from 'src/app/shared/functions/componentDestroyed';
import { ColumnDataType, filterType, IColumnDefinition } from 'src/app/shared/interfaces/IColumnFilter';
import { DialogService } from 'src/app/shared/widgets/general-dialog/dialog.service';
import { DialogData } from 'src/app/shared/widgets/general-dialog/general-dialog.component';
import { DefaultPageSize } from 'src/app/Utilities/Constants';
import { helper } from 'src/app/Utilities/Helpers';
import { SliderImagePath } from 'src/app/Utilities/PathTools';

@Component({
  selector: 'app-slider-table',
  templateUrl: './slider-table.component.html',
  styleUrls: ['./slider-table.component.scss'],
  animations: [
    trigger('detailExpandTrigger', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SliderTableComponent implements OnInit, OnDestroy {
  items$: Observable<SliderDTO[]>;
  rowDelete$ = new Subject();
  columns: IColumnDefinition<SliderDTO>[];

  ctrl_title = new FormControl('');
  ctrl_available = new FormControl('');
  ctrl_startPrice = new FormControl('');
  ctrl_endPrice = new FormControl('');
  ctrl_category = new FormControl('');

  imagePath = SliderImagePath;
  defaultPageSize = DefaultPageSize;

  pageEvent: PageEvent;
  expandedElement: SliderDTO | null;
  myDatasource: sliderDatasourceDTO = {
    items: null,
    pageSize: this.defaultPageSize,
    pageIndex: 0,
    totalItems: 0,
    text: '',
    orderBy: null
  };

  searchText: string = null;
  searchDate: string;
  isLoading: boolean = true;

  displayedColumns: string[] = [
    'id',
    'title',
    'imageName',
    'activeFrom', 'activeUntil',
    //'description', 
    // 'link',
    'edit','delete'];

  

  parseDate = helper.getPersianDate;

  constructor(private sliderService: SliderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private helperService:HelperService,) { }
  
  ngOnDestroy(): void { }

  ngOnInit(): void {
    this.setupColumns();
    this.setupFormListeners();
    this.setupEventListeners(); 

    // this.activatedRoute.queryParams.pipe(
    //   switchMap(params => {
    //     this.setDS(params);        
    //     return this.sliderService.getFilteredSliders(this.myDatasource);
    //   })
    // ).subscribe(res => {
    //   if (res) {
    //     this.myDatasource = res;
    //     this.isLoading = false;
    //   }
    //   //else ??????????????????????
    // });
  }
  //-----------------------------------------------
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
      {
        columnDef: 'activeFrom',
        header: 'نمایش از',        
        sortEnabled: true,
        cellData_Type: ColumnDataType.text,
        cellData_text: (element) => `${ helper.getPersianDate(element.activeFrom)}`,
        // filter: {
        //   type: filterType.input,
        //   details:[
        //     { label: 'نام محصول', value: this.myDatasource.text, control: this.ctrl_productName}
        //   ]
        // },
      },
      {
        columnDef: 'activeUntil',
        header: 'نمایش تا',        
        sortEnabled: true,
        cellData_Type: ColumnDataType.text,
        cellData_text: (element) => element.activeUntil? `${ helper.getPersianDate(element.activeUntil)}`:'',
        // filter: {
        //   type: filterType.input,
        //   details:[
        //     { label: 'نام محصول', value: this.myDatasource.text, control: this.ctrl_productName}
        //   ]
        // },
      }
      
    ];
    //console.log(this.columns)
  }
//----------------------------------------------------
  setupFormListeners() {
    this.filterListener_title();
    // this.filterListener_endPrice();
    // this.filterListener_startPrice();
    // this.filterListener_available();
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
  //-------------------------------------------------
  setupEventListeners() { 
    const queryParams$ = this.activatedRoute.queryParams.pipe(
      //tap(params=>console.log('onInit reading the route params:', params)),
      tap((params) => this.setDS(params))
    );
    //this.items$ = scheduled([queryParams$, this.rowDelete$], scheduled).pipe(mergeAll())
    this.items$ = merge(queryParams$, this.rowDelete$).pipe(      
      switchMap(() => this.sliderService.getFilteredSliders(this.myDatasource)),//filterText$,filterType$, repeated calls to service for each obs
      tap((res) => {
        this.myDatasource = res;
        this.isLoading = false;
        console.log(res)
      }),
      map((ds) => ds.items),
      takeUntil(componentDestroyed(this))
    );
  }
  //-------------------------------------------------
  setDS(params: Params) {
    this.myDatasource.pageIndex = params.page ? parseInt(params.page, 0) : 0;
    this.myDatasource.pageSize = params.pageSize ? parseInt(params.pageSize, 0): this.defaultPageSize;
    this.myDatasource.text = params.text;
    this.myDatasource.activeFromTime = params.activeFrom;// ? parseInt(params.startPrice, 0) : 0;    
    //this.myDatasource. = params.endPrice;// ? parseInt(params.endPrice, 0) : 0;//???????????
    this.myDatasource.orderBy = params.orderBy;    

    helper.control_setValue(this.ctrl_title,this.myDatasource.text);
    // helper.control_setValue(this.ctrl_endPrice,this.myDatasource.endPrice);
    // helper.control_setValue(this.ctrl_available,this.myDatasource.availableOnly);
    // helper.control_setValue(this.ctrl_productName,this.myDatasource.text);   
    
    console.log('onInit datasource',this.myDatasource)
  }

  buildQueryParams() {
    let queryParams: any = {};
    //if (this.myDatasource.text) 
    queryParams.text = this.myDatasource.text;
    queryParams.page = this.myDatasource.pageIndex;
    queryParams.pageSize = this.myDatasource.pageSize;
    queryParams.orderBy = this.myDatasource.orderBy;
    
    this.router.navigate([], { queryParams: queryParams });
  }
//--------------------------------------------
deleteRows(list:SliderDTO[]){
  console.log(list)
  this.sliderService.deleteSliderList(list.map(x=>x.id)).subscribe(()=>{
    this.rowDelete$.next();
  // this.snackBar.open( `ویژگی ${element.title} حذف شد`, 'OK', { duration: 5000 })
  })
}
  //----------------------------------------------------
  pageChange(){
    console.log('change',this.myDatasource)
    this.buildQueryParams();
    //this.rowDelete$.next();
  }

  sortChange(sort: Sort) {
    console.log(sort );
    this.myDatasource.orderBy = this.sortSwitch(sort);
    this.buildQueryParams();
  }

  sortSwitch(sort: Sort) : SliderOrderBy {
    if(sort.direction === '')
      return null;
    else
      switch (sort.active){
        case 'title':
          return (sort.direction ==='asc' ? SliderOrderBy.TitleAsc : SliderOrderBy.TitleDesc);
          
        case 'activeFrom':
          return (sort.direction==='asc' ? SliderOrderBy.ActiveFromAsc : SliderOrderBy.ActiveFromDesc);

        case 'activeUntil':
          return (sort.direction==='asc' ? SliderOrderBy.ActiveUntilAsc : SliderOrderBy.ActiveUntilDesc);
          
        default:
          return null;
      }    
  }


}
