import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild,} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { GenericDatasource } from 'src/app/DTOs/common/GenericDatasource';
import { DefaultPageSizeOptions } from 'src/app/Utilities/Constants';

import { ColumnDataType, IActionButton, IColumnDefinition, IColumnFilter, IRowClass, filterType,
} from 'src/app/shared/interfaces/IColumnFilter';
import { DialogService } from 'src/app/shared/widgets/general-dialog/dialog.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<T> implements OnInit {  
  @Output() rowDelete: EventEmitter<T[]> = new EventEmitter<T[]>();
  @Output() pageChange = new EventEmitter();
  @Output() sortChange = new EventEmitter<Sort>();
  @Output() clearFiltersEvent = new EventEmitter();

  @Input() dataSource!: GenericDatasource<T>; // @Input() dataSource: T[]; //DataSource<T>;
  @Input() items$: Observable<T[]>;
  @Input() columns: IColumnDefinition<T>[];
  @Input() filterActive?: boolean = true;

  @Input() rowConditionalStyleClass?: IRowClass<T>;

  @Input() singleBtn: IActionButton = { icon: 'mode_edit' };//{ icon: 'mode_edit', text: 'ویرایش' };
  @Input() menuButtons: IActionButton[] = [ { action: '', icon: 'delete_forever', text: 'ویرایش' } ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() pageSizeOptions?: number[] = DefaultPageSizeOptions;

  selection = new SelectionModel<T>(true, []);

  displayedColumns: string[];
  secondDisplayedColumns: string[];
  secondHeaderFilters: IColumnFilter[];
  filterType = filterType;
  filterPrefix = '';// 'جستجو در ';
  columnDataType = ColumnDataType;

  constructor(
    //private _liveAnnouncer: LiveAnnouncer,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    let tempColumns = this.columns.map((c) => c.columnDef);
    this.displayedColumns = ['select', ...tempColumns, 'buttons'];
    
    this.filterRowSetup();      
    
    // console.log('COLUMNS:',this.displayedColumns,'secondHeaders:',this.secondDisplayedColumns,
    // 'FILTERS',this.secondHeaderFilters.map(x=>x.data?.details))    
  }

  filterRowSetup(){
    if(this.filterActive){
      let tempFilters: IColumnFilter[] = [];
      this.columns.forEach((c) => {
        tempFilters.push({
          columnDef: 'filter-' + c.columnDef,
          data: c.filter ? c.filter : null,
        } as IColumnFilter);        
      });

      this.secondHeaderFilters = [
        { columnDef: 'filter-select', data: { type:filterType.noFilter_justText, details:null } },
        ...tempFilters,
        { columnDef: 'filter-buttons', data: { type:filterType.noFilter_button, details:null } },
      ];
      this.secondDisplayedColumns = this.secondHeaderFilters.map((x) => x.columnDef );
    }
  }
  //---------------------------
  paginateChange(event: PageEvent) {
    console.log(event)
    this.dataSource.pageIndex = event.pageIndex;
    this.dataSource.pageSize = event.pageSize;
    this.pageChange.emit();
  }

  onSortChange(sortState: Sort) {
    this.sortChange.emit(sortState);
  }

  //---------------------------------------
  //#region my functions called in html

  clearFilters(){
    this.clearFiltersEvent.emit();
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.items); // this.dataSource.data);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  ///
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    return numSelected === this.dataSource.totalItems;
  }

  /** The aria-label for the checkbox on the passed row */
  checkboxLabel(row?: T): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    //return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    return '';
  }

  //---------------------------------
  async removeElement(element: T) {
    if (await this.dialogService.removeConfirmDialog(`آیتم انتخاب شده حذف شود؟`))
      this.rowDelete.emit([element]);
  }

  async removeMultiple() {
    if ( await this.dialogService.removeConfirmDialog(
        ` ${this.selection.selected.length} آیتم انتخاب شده حذف شوند؟؟`))
      this.rowDelete.emit(this.selection.selected);
  }

  btnActionLink(id:number,extra:string): string{
    return extra ? id + '/' + extra : id.toString();
  }
  //#endregion
}
