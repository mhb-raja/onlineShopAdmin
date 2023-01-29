import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { ValueDatasource } from 'src/app/DTOs/category/ValueDTO';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-value-table',
  templateUrl: './value-table.component.html',
  styleUrls: ['./value-table.component.scss']
})
export class ValueTableComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  pageEvent: PageEvent;
  myDatasource:ValueDatasource={
    items: null,
    pageSize: 30,
    pageIndex: 0,
    totalItems: 0,
    AttribId:0,
    text:''
  }
  searchText: string = null;

  isLoading: boolean = true;

  displayedColumns: string[] = [
    'check',
    'id',
    'title',        
    'buttons'];

  constructor(private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

    ngOnInit(): void {
      this.activatedRoute.queryParams.pipe(
        tap(x=>console.log(x)),
        switchMap(params => {
          this.setDS(params);
          return this.productService.getFilteredAttribValues(this.myDatasource);
        })
      ).subscribe(res => {
        if (res) {
          this.myDatasource = res;
          this.isLoading = false;
        }        
      });
    }
  
    setDS(params: Params) {
      this.myDatasource.pageIndex = params.pageIndex ? parseInt(params.pageIndex, 0) : 0;
      this.myDatasource.pageSize = params.pageSize ? parseInt(params.pageSize, 0) : 10;
      this.myDatasource.text = params.text;
      this.myDatasource.AttribId=params.attribId ? parseInt(params.attibId,0) : null;
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
    removeElement(id: number) {}
}
