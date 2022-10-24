import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { sliderDatasourceDTO } from 'src/app/DTOs/slider/sliderDatasourceDTO';
import { SliderDTO } from 'src/app/DTOs/slider/SliderDTO';
import { SliderService } from 'src/app/services/slider.service';
import { DialogData, GeneralDialogComponent } from 'src/app/shared/widgets/general-dialog/general-dialog.component';
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
export class SliderTableComponent implements OnInit {

  pageEvent: PageEvent;
  expandedElement: SliderDTO | null;
  myDatasource: sliderDatasourceDTO = {
    items: null,
    pageSize: 10,
    pageIndex: 0,
    totalItems: 0,
    text: '',
    sort: ''
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

  imagePath = SliderImagePath;

  parseDate = helper.getPersianDate;

  constructor(private sliderService: SliderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog) { }


  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(
      switchMap(params => {
        this.setDS(params);        
        return this.sliderService.getFilteredSliders(this.myDatasource);
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
    this.myDatasource.sort = params.sort;
  }

  onPaginateChange(event: PageEvent) {
    this.myDatasource.pageIndex = event.pageIndex;
    this.myDatasource.pageSize = event.pageSize;
    this.buildQueryParams();
  }

  sortData(sort: Sort) {
    // console.log(`sort: avctive-${sort.active} direction-${sort.direction}`);
    this.myDatasource.sort = sort.direction;
    this.buildQueryParams();
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
    if (this.myDatasource.sort !== '') queryParams.sort = this.myDatasource.sort;

    this.router.navigate(['sliders'], { queryParams: queryParams });
  }

  removeElement(id: number) {
    if (id > 0) {
      const dialogRef = this.dialog.open(GeneralDialogComponent, {
        width: '250px',
        data: new DialogData('هشدار', 'اسلایدر حذف شود؟', 'بله', 'انصراف')
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(result);

        if (result !== undefined && result === true)
          this.sliderService.deleteSlider(id);
      });
      this.buildQueryParams();
    }

  }

}
