import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AttribDatasourceDTO } from 'src/app/DTOs/category/AttribDTO';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-attrib-table',
  templateUrl: './attrib-table.component.html',
  styleUrls: ['./attrib-table.component.scss']
})
export class AttribTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  pageEvent: PageEvent;

  myDatasource: AttribDatasourceDTO = {
    items: null,
    pageSize: 100,
    pageIndex: 0,
    totalItems: 0,
    text: '',
    typeId: 0
  };

  searchText: string = null;

  isLoading: boolean = true;

  displayedColumns: string[] = [
    'check',
    'id',
    'title',
    'valuesCount',    
    'buttons'];

  constructor(private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(
      switchMap(params => {
        this.setDS(params);
        return this.productService.getFilteredAttributes(this.myDatasource);
      })
    ).subscribe(res => {
      if (res) {
        this.myDatasource = res;
        this.isLoading = false;
      }
      //else ??????????????????????
    });
  }

  setDS(params: Params) {
    this.myDatasource.pageIndex = params.pageIndex ? parseInt(params.pageIndex, 0) : 0;
    this.myDatasource.pageSize = params.pageSize ? parseInt(params.pageSize, 0) : 10;
    this.myDatasource.text = params.text;
    this.searchText = params.text;

  }

  onPaginateChange(event: PageEvent) {
    this.myDatasource.pageIndex = event.pageIndex;
    this.myDatasource.pageSize = event.pageSize;
    this.buildQueryParams();
  }

  sortData(sort: Sort) {
    console.log(`sort: avctive-${sort.active} direction-${sort.direction}`,sort);
    // this.myDatasource.sort = sort.direction;
    // this.buildQueryParams();
  }

  buildQueryParams() {
    let queryParams: any = {};
    if (this.myDatasource.text) queryParams.text = this.myDatasource.text;
    queryParams.pageIndex = this.myDatasource.pageIndex;
    queryParams.pageSize = this.myDatasource.pageSize;
    //if (this.myDatasource.sort !== '') queryParams.sort = this.myDatasource.sort;

    this.router.navigate(['products'], { queryParams: queryParams });
  }
  removeElement(id: number) {
    // if (id > 0) {
    //   const dialogRef = this.dialog.open(GeneralDialogComponent, {
    //     width: '250px',
    //     data: new DialogData('هشدار', 'اسلایدر حذف شود؟', 'بله', 'انصراف')
    //   });

    //   dialogRef.afterClosed().subscribe(result => {
    //     console.log(result);

    //     if (result !== undefined && result === true)
    //       this.sliderService.deleteSlider(id);
    //   });
    //   this.buildQueryParams();
    // }
  }

  
}
