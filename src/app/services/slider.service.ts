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

  private homeSliders: BehaviorSubject<SliderDTO[]> = new BehaviorSubject<SliderDTO[]>(null);

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

  public getCurrentSliders(): Observable<SliderDTO[]> {
    return this.homeSliders;
  }

  public setCurrentSliders(sliders: SliderDTO[]) {
    this.homeSliders.next(sliders);
  }
  /*
  getHeroNo404<Data>(id: number): Observable<Hero> {
      const url = `${this.heroesUrl}/?id=${id}`;
      return this.http.get<Hero[]>(url)
        .pipe(
          map(heroes => heroes[0]), // returns a {0|1} element array
          tap(h => {
            const outcome = h ? `fetched` : `did not find`;
            this.log(`${outcome} hero id=${id}`);
          }),
          catchError(this.handleError<Hero>(`getHero id=${id}`))
        );
    }
   */


  public GetSliders(): Observable<IResponseResult<SliderDTO[]>> {
    return this.http.get<IResponseResult<SliderDTO[]>>('/slider/GetActiveSliders');
  }



  addSlider(slider: SliderDTO): Observable<boolean> {
    return this.http.post<IResponseResult<any>>("/slider/add-slider", slider).pipe(
      map(res => {
        if (res.eStatus === Status.Success)
          return true;
        else// if (res.eStatus === Status.NotFound)
          return this.errorHandler.handleServerUnsuccess(res, false);
      }),
      catchError(this.errorHandler.handleError<boolean>(`ثبت اسلایدر جدید `))
    );
  }

  addSlider2(slider: SliderDTO): Observable<SliderDTO> {
    return this.http.post<IResponseResult<SliderDTO>>("/slider2/add-slider", slider).pipe(
      map(res => {
        if (res.eStatus === Status.Success)
          return res.data;
        else// if (res.eStatus === Status.NotFound)
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
      catchError(this.errorHandler.handleError<sliderDatasourceDTO>(`دریافت لیست اسلایدرها `))
    );
  }

  generateFilterParams(filter: sliderDatasourceDTO): HttpParams {
    let params;

    if (filter !== null) {
      params = new HttpParams()
        .set('pageIndex', filter.pageIndex.toString())
        .set('pageSize', filter.pageSize.toString());

      if (filter.text)
        params = params.append('text', filter.text);

      if (filter.sort)
        params = params.append('sort', filter.sort);

      if (filter.activeFromTime != null)
        params = params.append('activeFromTime', filter.activeFromTime.toString());
    }
    return params;
  }

  getSliderForEdit(id: number): Observable<SliderDTO> {
    if (!id)
      return of(null);
    return this.http.get<IResponseResult<SliderDTO>>('/slider/get-slider-for-edit/' + id).pipe(
      map(res => {
        if (res.eStatus === Status.Success)
          return res.data;
        else// if (res.eStatus === Status.NotFound)
          return this.errorHandler.handleServerUnsuccess(res, null);
      }),
      catchError(this.errorHandler.handleError<SliderDTO>(`دریافت اطلاعات اسلایدر :${id}`))
    );
  }

  editSlider(slider: SliderDTO): Observable<boolean> {
    return this.http.post<IResponseResult<any>>('/slider/edit-slider', slider).pipe(
      map(res => {
        if (res.eStatus === Status.Success)
          return true;
        else// if (res.eStatus === Status.NotFound)
          return this.errorHandler.handleServerUnsuccess(res, false);
      }),
      catchError(this.errorHandler.handleError<boolean>(`ویرایش اطلاعات اسلایدر : ${slider.id}`))
    );
  }

  editSlider2(slider: SliderDTO): Observable<SliderDTO> {
    return this.http.post<IResponseResult<SliderDTO>>('/slider2/edit-slider', slider).pipe(
      map(res => {
        if (res.eStatus === Status.Success)
          return res.data;
        else// if (res.eStatus === Status.NotFound)
          return this.errorHandler.handleServerUnsuccess(res, null);
      }),
      catchError(this.errorHandler.handleError<SliderDTO>(`ویرایش اطلاعات اسلایدر : ${slider.id}`))
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
}
