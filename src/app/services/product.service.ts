import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AttribDatasourceDTO, AttribDTO, AttribMiniDTO, AttribTypeDTO } from '../DTOs/category/AttribDTO';
import {
  CategoryDTO,
  CategoryDetailDTO,
  CategoryMiniDTO,
  //CategoryTreeItemDTO,
} from '../DTOs/category/CategoryDTO';
import { ValueDatasource, ValueDTO } from '../DTOs/category/ValueDTO';
import { IResponseResult, Status } from '../DTOs/common/IResponseResult';
import { ProductCommentDatasource } from '../DTOs/product/ProductCommentDTO';
import { productDatasourceDTO, ProductDTO } from '../DTOs/product/ProductDTO';
import {
  ProductGalleryDTO,
  ProductGalleryMiniDTO,
} from '../DTOs/product/ProductGalleryDTO';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  //#region product

  addProduct(prd: ProductDTO): Observable<ProductDTO> {
    return this.http
      .post<IResponseResult<ProductDTO>>('/adminproduct/add-product', prd)
      .pipe(
        map((res) => {
          if (res.eStatus === Status.Success) return res.data;
          // if (res.eStatus === Status.NotFound)
          else return this.errorHandler.handleServerUnsuccess(res, null);
        }),
        catchError(this.errorHandler.handleError<ProductDTO>(`ثبت محصول جدید `))
      );
  }

  getProductDetails(id: number): Observable<ProductDTO> {
    if (!id) return of(null);

    return this.http
      .get<IResponseResult<ProductDTO>>('/adminproduct/get-product-for-edit/' + id)
      .pipe(
        map((res) => {
          if (res.eStatus === Status.Success) return res.data;
          // else if (res.eStatus === Status.NotFound)
          // {}
          else return this.errorHandler.handleServerUnsuccess(res, null);
        }),
        catchError(
          this.errorHandler.handleError<ProductDTO>(
            `دریافت اطلاعات محصول :${id}`
          )
        )
      );
  }

  editProduct(product: ProductDTO): Observable<ProductDTO> {
    return this.http
      .post<IResponseResult<ProductDTO>>('/adminproduct/edit-product', product)
      .pipe(
        map((res) => {
          if (res.eStatus === Status.Success) return res.data;
          // if (res.eStatus === Status.NotFound)
          else return this.errorHandler.handleServerUnsuccess(res, null);
        }),
        catchError(
          this.errorHandler.handleError<ProductDTO>(
            `ویرایش اطلاعات محصول :${product.id}`
          )
        )
      );
  }

  getFilteredProducts(filter: productDatasourceDTO): Observable<productDatasourceDTO> {
    let params = this.generateProductFilterParams(filter);
    return this.http
      .get<IResponseResult<productDatasourceDTO>>(
        '/adminproduct/filter-products',
        { params }
      )
      .pipe(
        map((res) => {
          if (res.eStatus === Status.Success) return res.data;
          else return this.errorHandler.handleServerUnsuccess(res, null);
        }),
        catchError(this.errorHandler.handleError<productDatasourceDTO>(`دریافت لیست محصولات `))
      );
  }

  generateProductFilterParams(filter: productDatasourceDTO): HttpParams {
    let params;
    // if (filter !== null) {

    //   params = new HttpParams()
    //   for (const category of filter.categories) {
    //     params = params.append('categories', category.toString());
    //   }
    //   if (filter.orderBy != null)
    //     params = params.append('orderBy', filter.orderBy.toString());
    // }

    if (filter !== null) {
      params = new HttpParams()
        .set('pageIndex', filter.pageIndex.toString())
        .set('pageSize', filter.pageSize.toString());

      if (filter.text) params = params.append('text', filter.text);

      // if (filter.sort)
      //   params = params.append('sort', filter.sort);

      if (filter.startPrice != null)
        params = params.append('startPrice', filter.startPrice.toString());
      if (filter.endPrice != null)
        params = params.append('endPrice', filter.endPrice.toString());
    }
    return params;
  }

  deleteProduct(id: number): Observable<boolean> {
    return this.http.get<IResponseResult<any>>('/adminproduct/delete-product/' + id).pipe(
      map((res) => {
        if (res.eStatus === Status.Success) return true;
        else return this.errorHandler.handleServerUnsuccess(res, false);
      }),
      catchError(this.errorHandler.handleError<boolean>(`حذف محصول:${id}`))
    );
  }

  //#endregion
  //--------------------------------------
  //#region category
  addCategory(ctg: CategoryDTO): Observable<boolean> {
    return this.http
      .post<IResponseResult<any>>('/adminproduct/add-category', ctg)
      .pipe(
        map((res) => {
          if (res.eStatus === Status.Success) return true;          
          else return this.errorHandler.handleServerUnsuccess(res, false);
        }),
        catchError(this.errorHandler.handleError<boolean>(`ثبت کتگوری جدید : ${ctg.title}`))        
      );
  }
  addCategory_returnId(ctg: CategoryDTO): Observable<CategoryDTO> {
    return this.http
      .post<IResponseResult<any>>('/adminproduct/add-category-retId', ctg)
      .pipe(
        map((res) => {
          if (res.eStatus === Status.Success) return res.data;          
          else return this.errorHandler.handleServerUnsuccess(res, null);
        }),
        catchError(this.errorHandler.handleError<CategoryDTO>(`ثبت کتگوری جدید : ${ctg.title}`))
      );
  }
  //
  getCategoryPath(id: number): Observable<CategoryMiniDTO[]> {
    return this.http
      .get<IResponseResult<CategoryMiniDTO[]>>(
        '/adminproduct/get-category-path/' + id
      )
      .pipe(
        map((res) => {
          if (res.eStatus === Status.Success) return res.data;
          else return this.errorHandler.handleServerUnsuccess(res, null);
        }),
        catchError(
          this.errorHandler.handleError<CategoryMiniDTO[]>(
            `دریافت مسیر کتگوری :${id}`
          )
        )
      );
  }
  getCategoryDetail(id: number): Observable<CategoryDetailDTO> {
    return this.http
      .get<IResponseResult<CategoryDetailDTO>>(
        '/adminproduct/get-category-detail/' + id
      )
      .pipe(
        map((res) => {
          if (res.eStatus === Status.Success) return res.data;
          else return this.errorHandler.handleServerUnsuccess(res, null);
        }),
        catchError(
          this.errorHandler.handleError<CategoryDetailDTO>(
            `دریافت اطلاعات کتگوری :${id}`
          )
        )
      );
  }

  editCategory(ctg: CategoryDTO): Observable<boolean> {
    return this.http
      .post<IResponseResult<any>>('/adminproduct/edit-category', ctg)
      .pipe(
        map((res) => {
          if (res.eStatus === Status.Success) return true;
          // if (res.eStatus === Status.NotFound)
          else return this.errorHandler.handleServerUnsuccess(res, false);
        }),
        catchError(
          this.errorHandler.handleError<boolean>(
            `ویرایش اطلاعات کتگوری : ${ctg.id}`
          )
        )
      );
  }

  public GetCategoryChildren(id:number):Observable<CategoryDTO[]>{
    return this.http
    .get<IResponseResult<CategoryDTO[]>>('/product/child-categories/' + id)
    .pipe(
      map((res) => {
        if (res.eStatus === Status.Success) return res.data;
        // if (res.eStatus === Status.NotFound)
        else return this.errorHandler.handleServerUnsuccess(res, null);
      }),
      catchError(
        this.errorHandler.handleError<CategoryDTO[]>(
          `دریافت فرزندان کتگوری : ${id}`
        )
      )
    );
  }
  //#endregion
  //---------------------------------------
  //#region attrib
  getFilteredAttributes(filter: AttribDatasourceDTO): Observable<AttribDatasourceDTO> {
    let params;   
    if (filter !== null) {
      params = new HttpParams()
        .set('pageIndex', filter.pageIndex.toString())
        .set('pageSize', filter.pageSize.toString());

      if (filter.text)
        params = params.append('text', filter.text);
      if(filter.typeId)
        params=params.append('typeId',filter.typeId);
    }
    return this.http.get<IResponseResult<AttribDatasourceDTO>>('/adminproduct/filter-attributes', { params })
    .pipe(
      map(res=>{
        if(res.eStatus===Status.Success) return res.data;
        else return this.errorHandler.handleServerUnsuccess(res,null);
      }),
      catchError(this.errorHandler.handleError<AttribDatasourceDTO>('دریافت فیلتر ویژگی ها'))
    );    
  }

  addAttrib_returnId(attrib: AttribDTO): Observable<AttribDTO> {
    return this.http
      .post<IResponseResult<any>>('/adminproduct/add-attrib-retId', attrib)
      .pipe(
        map((res) => {
          if (res.eStatus === Status.Success) return res.data;          
          else return this.errorHandler.handleServerUnsuccess(res, null);
        }),
        catchError(this.errorHandler.handleError<AttribDTO>(`ثبت ویژگی جدید : ${attrib.title}`))
      );
  }

  getAttribDetail(id: number): Observable<AttribDTO> {
    return this.http
      .get<IResponseResult<AttribDTO>>( '/adminproduct/get-attrib-detail/' + id)
      .pipe(
        map((res) => {
          if (res.eStatus === Status.Success) return res.data;
          else return this.errorHandler.handleServerUnsuccess(res, null);
        }),
        catchError(this.errorHandler.handleError<AttribDTO>(`دریافت اطلاعات ویژگی :${id}`))
      );
  }

  editAttrib(item: AttribDTO): Observable<boolean> {
    return this.http
      .post<IResponseResult<any>>('/adminproduct/edit-attrib', item)
      .pipe(
        map((res) => {
          if (res.eStatus === Status.Success) return true;
          else return this.errorHandler.handleServerUnsuccess(res, false);
        }),
        catchError(this.errorHandler.handleError<boolean>(`ویرایش اطلاعات ویژگی : ${item.id}`))
      );
  }

  deleteAttrib(id: number): Observable<boolean> {
    return this.http.get<IResponseResult<any>>('/adminproduct/delete-attrib/' + id).pipe(
      map((res) => {
        if (res.eStatus === Status.Success) return true;
        else return this.errorHandler.handleServerUnsuccess(res, false);
      }),
      catchError(this.errorHandler.handleError<boolean>(`حذف ویژگی:${id}`))
    );
  }

  getAttribTypes(): Observable<AttribTypeDTO[]> {
    return this.http.get<IResponseResult<any>>('/adminproduct/get-attrib-types').pipe(
      map((res) => {
        if (res.eStatus === Status.Success) return res.data;
        else return this.errorHandler.handleServerUnsuccess(res, null);
      }),
      catchError(this.errorHandler.handleError<boolean>(`دریافت انواع ویژگی`))
    );
  }

  getAttribsList(): Observable<AttribMiniDTO[]> {
    return this.http.get<IResponseResult<any>>('/adminproduct/get-attrib-list').pipe(
      map((res) => {
        if (res.eStatus === Status.Success) return res.data;
        else return this.errorHandler.handleServerUnsuccess(res, null);
      }),
      catchError(this.errorHandler.handleError<boolean>(`دریافت لیست ویژگی ها`))
    );
  }
  //#endregion
//-------------------------  
  //#region attrib-value

  getFilteredAttribValues(filter: ValueDatasource): Observable<ValueDatasource> {
    let params;   
    if (filter !== null) {
      params = new HttpParams()
        .set('pageIndex', filter.pageIndex.toString())
        .set('pageSize', filter.pageSize.toString());

      if (filter.text)
        params = params.append('text', filter.text);
      if(filter.AttribId)
        params=params.append('attribId',filter.AttribId);
    }
    return this.http.get<IResponseResult<ValueDatasource>>('/adminproduct/filter-attrib-values', { params })
    .pipe(
      map(res=>{
        if(res.eStatus===Status.Success) return res.data;
        else return this.errorHandler.handleServerUnsuccess(res,null);
      }),
      catchError(this.errorHandler.handleError<ValueDatasource>('دریافت فیلتر مقدار ها'))
    );    
  }

  addAttribValue_returnId(item: ValueDTO): Observable<ValueDTO> {
    return this.http
      .post<IResponseResult<any>>('/adminproduct/add-attrib-value-retId', item)
      .pipe(
        map((res) => {
          if (res.eStatus === Status.Success) return res.data;          
          else return this.errorHandler.handleServerUnsuccess(res, null);
        }),
        catchError(this.errorHandler.handleError<ValueDTO>(`ثبت مقدار جدید : ${item.title}`))
      );
  }

  getAttribValueDetail(id: number): Observable<ValueDTO> {
    return this.http
      .get<IResponseResult<ValueDTO>>( '/adminproduct/get-attrib-value-detail/' + id)
      .pipe(
        map((res) => {
          if (res.eStatus === Status.Success) return res.data;
          else return this.errorHandler.handleServerUnsuccess(res, null);
        }),
        catchError(this.errorHandler.handleError<ValueDTO>(`دریافت اطلاعات مقدار :${id}`))
      );
  }

  editAttribValue(item: ValueDTO): Observable<boolean> {
    return this.http
      .post<IResponseResult<any>>('/adminproduct/edit-attrib-value', item)
      .pipe(
        map((res) => {
          if (res.eStatus === Status.Success) return true;
          else return this.errorHandler.handleServerUnsuccess(res, false);
        }),
        catchError(this.errorHandler.handleError<boolean>(`ویرایش مقدار : ${item.id}`))
      );
  }

  deleteAttribValue(id: number): Observable<boolean> {
    return this.http.get<IResponseResult<any>>('/adminproduct/delete-attrib-value/' + id).pipe(
      map((res) => {
        if (res.eStatus === Status.Success) return true;
        else return this.errorHandler.handleServerUnsuccess(res, false);
      }),
      catchError(this.errorHandler.handleError<boolean>(`حذف مقدار ویژگی:${id}`))
    );
  }

  getAttribValuesList(id?:number): Observable<ValueDTO[]> {
    return this.http.get<IResponseResult<any>>('/adminproduct/get-attrib-values-list/' + id).pipe(
      map((res) => {
        if (res.eStatus === Status.Success) return res.data;
        else return this.errorHandler.handleServerUnsuccess(res, null);
      }),
      catchError(this.errorHandler.handleError<boolean>(`دریافت لیست مقادیر ویژگی ` + id))
    );
  }
  //#endregion
  //-------------------------------------------------------------------
  //#region gallery

  getProductGalleries(productId: number): Observable<ProductGalleryMiniDTO[]> {
    return this.http
      .get<IResponseResult<ProductGalleryMiniDTO[]>>(
        '/adminproduct/product-galleries/' + productId
      )
      .pipe(
        map((res) => {
          if (res.eStatus === Status.Success) return res.data;
          else return this.errorHandler.handleServerUnsuccess(res, null);
        }),
        catchError(
          this.errorHandler.handleError<ProductGalleryMiniDTO[]>(
            `دریافت لیست گالری محصول ${productId}`
          )
        )
      );
  }

  addGallery(gal: ProductGalleryDTO): Observable<boolean> {
    return this.http
      .post<IResponseResult<any>>('/adminproduct/add-gallery', gal)
      .pipe(
        map((res) => {
          if (res.eStatus === Status.Success) return true;
          // if (res.eStatus === Status.NotFound)
          else return this.errorHandler.handleServerUnsuccess(res, false);
        }),
        catchError(
          this.errorHandler.handleError<ProductDTO>(
            `ثبت گالری جدید برای محصول ${gal.productId}`
          )
        )
      );
  }

  deleteGallery(id: number): Observable<boolean> {
    return this.http
      .get<IResponseResult<any>>('/adminproduct/delete-gallery/' + id)
      .pipe(
        map((res) => {
          if (res.eStatus === Status.Success) return true;
          // if (res.eStatus === Status.NotFound)
          else return this.errorHandler.handleServerUnsuccess(res, false);
        }),
        catchError(
          this.errorHandler.handleError<ProductDTO>(
            `حذف گالری ${id} برای محصول `
          )
        )
      );
  }
  //#endregion

  //--------------------------------------------------------------------------

  //#region comments

  getFilteredComments(
    filter: ProductCommentDatasource
  ): Observable<ProductCommentDatasource> {
    let params = this.generateCommentFilterParams(filter);
    return this.http
      .get<IResponseResult<ProductCommentDatasource>>(
        '/adminproduct/filter-comments',
        { params }
      )
      .pipe(
        map((res) => {
          if (res.eStatus === Status.Success) return res.data;
          else return this.errorHandler.handleServerUnsuccess(res, null);
        }),
        catchError(
          this.errorHandler.handleError<ProductCommentDatasource>(
            `دریافت لیست نظرات `
          )
        )
      );
  }

  generateCommentFilterParams(filter: ProductCommentDatasource): HttpParams {
    let params;
    if (filter !== null) {
      params = new HttpParams()
        .set('onlyNotSeen', filter.onlyNotSeen)
        .set('pageIndex', filter.pageIndex.toString())
        .set('pageSize', filter.pageSize.toString());

      if (filter.text) params = params.append('text', filter.text);

      // if (filter.sort)
      //   params = params.append('sort', filter.sort);

      if (filter.productId != null)
        params = params.append('productId', filter.productId.toString());
    }
    return params;
  }

  deleteComment(id: number): Observable<boolean> {
    return this.http.get<IResponseResult<any>>('/adminproduct/delete-comment/' + id).pipe(
      map((res) => {
        if (res.eStatus === Status.Success) return true;
        else return this.errorHandler.handleServerUnsuccess(res, false);
      }),
      catchError(this.errorHandler.handleError<boolean>(`حذف نظر:${id}`))
    );
  }

  getUnreadCommentsCount(): Observable<number> {   
    return this.http.get<IResponseResult<number>>('/adminproduct/unread-comments-count' ).pipe(
      map((res) => {
        if (res.eStatus === Status.Success) return res.data;
        else return this.errorHandler.handleServerUnsuccess(res, -1);
      }),
      catchError(this.errorHandler.handleError<number>(`تعداد کامنت های مشاهده نشده`))
    );
  }
  //#endregion 
  
}
