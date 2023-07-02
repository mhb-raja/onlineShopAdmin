import { MatPaginatorIntl } from "@angular/material/paginator";

export function CustomPaginator() {
    const customPaginatorIntl = new MatPaginatorIntl();
  
    customPaginatorIntl.itemsPerPageLabel = 'تعداد آیتم در هر صفحه:';
    customPaginatorIntl.previousPageLabel = "صفحه قبلی";
    customPaginatorIntl.nextPageLabel = "صفحه بعدی";
    customPaginatorIntl.lastPageLabel = "صفحه آخر";
    customPaginatorIntl.firstPageLabel = "صفحه اول";
    //customPaginatorIntl.getRangeLabel
    return customPaginatorIntl;
  }