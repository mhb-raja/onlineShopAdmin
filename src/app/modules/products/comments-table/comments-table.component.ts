import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ProductCommentForAdminDTO, ProductCommentDatasource } from 'src/app/DTOs/product/ProductCommentDTO';
import { helper } from 'src/app/Utilities/Helpers';
import { ProductImagePath } from 'src/app/Utilities/PathTools';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-comments-table',
  templateUrl: './comments-table.component.html',
  styleUrls: ['./comments-table.component.scss'],
  animations: [
    trigger('detailExpandTrigger', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class CommentsTableComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  pageEvent: PageEvent;
  expandedElement:  ProductCommentForAdminDTO | null;
  myDatasource: ProductCommentDatasource = {
    items: null,
    pageSize: 10,
    pageIndex: 0,
    totalItems: 0,
    text: '',
    productId: null,
    seenOnly: false,
    productName: ''
  };

  searchText: string = null;
  searchDate: string;
  isLoading: boolean = true;

  displayedColumns: string[] = [
    'id',
    'productName',
    'productImage',
    'commentText',
    'date',
    'seen',
    'approved',
    'delete',
  ];

  imagePath = ProductImagePath;
  persianDate = helper.getPersianDate;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(
        switchMap((params) => {
          this.setDS(params);
          return this.productService.getFilteredComments(this.myDatasource);
        })
      )
      .subscribe((res) => {
        console.log(res, this.myDatasource);
        if (res) {
          this.myDatasource = res;
          this.isLoading = false;
          console.log(this.myDatasource.items[6].seenByAdmin);
          
        }
        //else ??????????????????????
      });
  }

  setDS(params: Params) {
    console.log('params', params);

    this.myDatasource.pageIndex = params.pageIndex? parseInt(params.pageIndex, 0) : 0;
    this.myDatasource.pageSize = params.pageSize ? parseInt(params.pageSize, 0): 10;
    this.myDatasource.text = params.text;
    this.searchText = params.text;
    this.myDatasource.productId = params.productId; // ? parseInt(params.startPrice, 0) : 0;
    this.myDatasource.seenOnly = params.seenOnly? params.seenOnly: false;
    console.log('ds', this.myDatasource);
  }

  onPaginateChange(event: PageEvent) {
    this.myDatasource.pageIndex = event.pageIndex;
    this.myDatasource.pageSize = event.pageSize;
    this.buildQueryParams();
  }

  sortData(sort: Sort) {
    console.log(
      `sort: avctive-${sort.active} direction-${sort.direction}`,
      sort
    );
    // this.myDatasource.sort = sort.direction;
    // this.buildQueryParams();
  }

  findByText(text: string) {
    this.myDatasource.text = text;
    this.buildQueryParams();
  }

  buildQueryParams() {
    let queryParams: any = {};
    if (this.myDatasource.text) queryParams.text = this.myDatasource.text;
    queryParams.pageIndex = this.myDatasource.pageIndex;
    queryParams.pageSize = this.myDatasource.pageSize;
    //if (this.myDatasource.sort !== '') queryParams.sort = this.myDatasource.sort;

    this.router.navigate(['/products/comments'], { queryParams: queryParams });
  }

  removeElement(id: number) {

  }
}