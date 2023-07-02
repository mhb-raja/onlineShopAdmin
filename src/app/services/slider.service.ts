import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IResponseResult, Status } from '../DTOs/common/IResponseResult';
import { sliderDatasourceDTO } from '../DTOs/slider/sliderDatasourceDTO';
import { SliderDTO } from '../DTOs/slider/SliderDTO';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class SliderService {

  //private homeSliders: BehaviorSubject<SliderDTO[]> = new BehaviorSubject<SliderDTO[]>(null);

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

  // public getCurrentSliders(): Observable<SliderDTO[]> {
  //   return this.homeSliders;
  // }

  // public setCurrentSliders(sliders: SliderDTO[]) {
  //   this.homeSliders.next(sliders);
  // }

  public GetSliders(): Observable<SliderDTO[]> {
    return this.http.get<IResponseResult<SliderDTO[]>>('/slider/GetActiveSliders').pipe(
      map(res => {
        if (res.eStatus === Status.Success)
          return res.data;
        else// if (res.eStatus === Status.NotFound)
          return this.errorHandler.handleServerUnsuccess(res, null);
      }),
      catchError(this.errorHandler.handleError<SliderDTO[]>(`دریافت لیست اسلایدرها `))
    );
  }

  addSlider(slider: SliderDTO): Observable<SliderDTO> {
    return this.http.post<IResponseResult<SliderDTO>>("/slider/add-slider", slider).pipe(
      map(res => {
        if (res.eStatus === Status.Success) return res.data;
        else
          return this.errorHandler.handleServerUnsuccess(res, null);
      }),
      catchError(this.errorHandler.handleError<SliderDTO>(`ثبت اسلایدر جدید `))
    );
  }

  getFilteredSliders(filter: sliderDatasourceDTO): Observable<sliderDatasourceDTO> {
    let params = this.generateFilterParams(filter);
    return this.http.get<IResponseResult<sliderDatasourceDTO>>('/slider/filter-sliders', { params }).pipe(
      map(res => {
        if (res.eStatus === Status.Success)
          return res.data;
        else
          return this.errorHandler.handleServerUnsuccess(res, null);
      }),
      catchError(this.errorHandler.handleError<sliderDatasourceDTO>(`دریافت فیلتر اسلایدرها `))
    );
  }

  generateFilterParams(filter: sliderDatasourceDTO): HttpParams {
    let params;

    if (filter !== null) {
      params = new HttpParams()
        .set('page', filter.pageIndex.toString())
        .set('pageSize', filter.pageSize.toString());

      if (filter.text) params = params.append('text', filter.text);
      if (filter.orderBy) params = params.append('orderBy', filter.orderBy);
      if (filter.activeFromTime != null) params = params.append('activeFromTime', filter.activeFromTime.toString());
    }
    return params;
  }

  getSliderForEdit(id: number): Observable<SliderDTO> {
    if (!id)
      return of(null);
    return this.http.get<IResponseResult<SliderDTO>>('/slider/get-slider-for-edit/' + id).pipe(
      map(res => {
        if (res.eStatus === Status.Success) return res.data;
        else
          return this.errorHandler.handleServerUnsuccess(res, null);
      }),
      catchError(this.errorHandler.handleError<SliderDTO>(`دریافت اطلاعات اسلایدر :${id}`))
    );
  }

  editSlider(item: SliderDTO): Observable<boolean> {
    return this.http.post<IResponseResult<any>>('/slider/edit-slider', item).pipe(
      map((res) => {
        if (res.eStatus === Status.Success) return true;
        else return this.errorHandler.handleServerUnsuccess(res, false);
      }),
      catchError(this.errorHandler.handleError<boolean>(`ویرایش اطلاعات اسلایدر : ${item.id}`))
    );      
  }

  deleteSlider(id: number): Observable<boolean> {
    return this.http.get<IResponseResult<any>>('/slider/remove-slider/' + id).pipe(
      map(res => {
        console.log(res);

        if (res.eStatus === Status.Success)
          return true;
        else
          return this.errorHandler.handleServerUnsuccess(res, false);
      }),
      catchError(this.errorHandler.handleError<boolean>(`حذف اسلایدر : ${id}`))
    );
  }

  deleteSliderList(idList: number[]): Observable<boolean> {
    return this.http.put<IResponseResult<any>>('/slider/delete-slider-list', idList).pipe(
      map((res) => {
        if (res.eStatus === Status.Success) return true;
        else return this.errorHandler.handleServerUnsuccess(res, false);
      }),
      catchError(this.errorHandler.handleError<boolean>(`حذف اسلایدر های :${idList}`))
    );
  }
}
