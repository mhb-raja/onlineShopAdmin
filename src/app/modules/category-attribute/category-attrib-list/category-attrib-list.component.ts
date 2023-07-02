import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, fromEvent } from 'rxjs';
import { exhaustMap, takeUntil, tap, throttleTime } from 'rxjs/operators';
import { Attribs_forCategoryDTO } from 'src/app/DTOs/category/CategoryAttribDTO';
import { ConstMaxLengthText } from 'src/app/Utilities/Constants';
import { ProductService } from 'src/app/services/product.service';
import { componentDestroyed } from 'src/app/shared/functions/componentDestroyed';
import { DialogService } from 'src/app/shared/widgets/general-dialog/dialog.service';


@Component({
  selector: 'app-category-attrib-list',
  templateUrl: './category-attrib-list.component.html',
  styleUrls: ['./category-attrib-list.component.scss']
})
export class CategoryAttribListComponent implements OnInit,OnDestroy,AfterViewInit {
  maxLenText = ConstMaxLengthText;
  textCtrl = new FormControl('');

  selectedList:any;
  catId: number;
  data$: Observable<Attribs_forCategoryDTO> = null;
  editMode:boolean=false;
  categoryTitle:string;

  selectControl = new FormControl('');
  //selectControl = new MatSelectionList(null);

  constructor(private productService: ProductService,
    private activatedRoute: ActivatedRoute,private router:Router,
    private dialogService: DialogService) { }  
  
  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.catId = parseInt(this.activatedRoute.snapshot.paramMap.get('catId')!);
    this.data$ = this.productService.getCategoryAttribs(this.catId).pipe(
      tap(x => {
        this.categoryTitle = x.categoryTitle;
        this.selectedList = x.chosen.map(item=>item.id)
      })
    );//.subscribe(res=>console.log(res));
  }

  ngAfterViewInit(): void {
    this.setupEventListeners();
  }

  private setupEventListeners() {    
    const btnChange = document.getElementById('btnChange');    
    fromEvent(btnChange,'click').pipe(      
      throttleTime(1000),
      tap(x=>console.log(this.editMode,this.selectedList)),
      exhaustMap(()=>this.productService.categoryAttrib_listChange(this.catId,this.selectedList)),
      takeUntil(componentDestroyed(this))
    ).subscribe((res) => {      
      //console.log(res)
    });
  }

  setupTableColumns(){
    // const columns:columnDefinition<AttribMiniDTO>[] = [
    //   {
    //     columnDef: 'id',
    //     header: 'No.',
    //     cell: (element: AttribMiniDTO) => `${element.id}`,
    //     //filterEnabled:false,
    //     sortEnabled:false
    //   },
    //   {
    //     columnDef: 'title',
    //     header: 'عنوان',
    //     cell: (element: AttribMiniDTO) => `${element.title}`,
    //     //filterEnabled:true,
    //     sortEnabled:true
    //   },
    //   {
    //     columnDef: 'type',
    //     header: 'نوع',
    //     cell: (element: AttribMiniDTO) => `${element.typeId}`,
    //   },      
    // ];
  }
  // setupFormListeners(){
  //   const filterText$ = this.textCtrl.valueChanges.pipe(
  //     debounceTime(500),
  //     distinctUntilChanged(),
  //     tap(x=> { this.myDatasource.text = x; this.buildQueryParams();})     
  //   );
  //   filterText$.subscribe();

  //   const filterType$ = this.typeCtrl.valueChanges.pipe(
  //     tap(x=>{ this.myDatasource.typeId=x; this.buildQueryParams(); }));
  //   filterType$.subscribe();
  // }


}
