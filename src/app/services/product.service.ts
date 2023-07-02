import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AttribDatasourceDTO, AttribDTO, AttribMiniDTO, AttribTypeDTO } from '../DTOs/category/AttribDTO';
import { CategoryDTO, CategoryMiniDTO,} from '../DTOs/category/CategoryDTO';
import { ValueDatasourceDTO, ValueDTO, ValueFullDetailDTO } from '../DTOs/category/ValueDTO';
import { IResponseResult, Status } from '../DTOs/common/IResponseResult';
import { ProductCommentDatasource } from '../DTOs/product/ProductCommentDTO';
import { productDatasourceDTO, ProductDTO } from '../DTOs/product/ProductDTO';
import {
  ProductGalleryDTO,
  ProductGalleryMiniDTO,
} from '../DTOs/product/ProductGalleryDTO';
import { ErrorHandlerService } from './error-handler.service';
import { Attribs_forCategoryDTO, categoryAttribsChangeDTO } from '../DTOs/category/CategoryAttribDTO';


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
      .post<IResponseResult<ProductDTO>>('/adminproduct/add-product', prd).pipe(
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
    return this.http.get<IResponseResult<productDatasourceDTO>>('/adminproduct/filter-products',{ params })
      .pipe(
        map((res) => {
          if (res.eStatus === Status.Success) return res.data;
          else return this.errorHandler.handleServerUnsuccess(res, null);
        }),
        catchError(this.errorHandler.handleError<productDatasourceDTO>(`دریافت لیست محصولات `))
      );
  }

  generateProductFilterParams(filter: productDatasourceDTO): HttpParams {
    let params: HttpParams;
    //   for (const category of filter.categories) {
    //     params = params.append('categories', category.toString());
    //   }
    if (filter !== null) {
      params = new HttpParams()
        .set('pageIndex', filter.pageIndex)
        .set('pageSize', filter.pageSize);

      if (filter.text) params = params.append('text', filter.text);      
      if (filter.orderBy) params = params.append('orderBy', filter.orderBy);
      if (filter.startPrice) params = params.append('startPrice', filter.startPrice);
      if (filter.endPrice) params = params.append('endPrice', filter.endPrice);
      if (filter.availableOnly != undefined) params = params.append('availableOnly', filter.availableOnly);
    }
    console.log(filter,params)
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
  
  deleteProductList(idList: number[]): Observable<boolean> {
    return this.http.put<IResponseResult<any>>('/adminproduct/delete-product-list', idList).pipe(
      map((res) => {
        if (res.eStatus === Status.Success) return true;
        else return this.errorHandler.handleServerUnsuccess(res, false);
      }),
      catchError(this.errorHandler.handleError<boolean>(`حذف محصول :${idList}`))
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
  getCategoryDetail(id: number): Observable<CategoryDTO> {
    return this.http
      .get<IResponseResult<CategoryDTO>>(
        '/adminproduct/get-category-detail/' + id
      )
      .pipe(
        map((res) => {
          if (res.eStatus === Status.Success) return res.data;
          else return this.errorHandler.handleServerUnsuccess(res, null);
        }),
        catchError(
          this.errorHandler.handleError<CategoryDTO>(
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

  getCategoryChildren(id:number):Observable<CategoryDTO[]>{
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

  getCategoriesList(): Observable<CategoryDTO[]> {
    return this.http.get<IResponseResult<CategoryDTO[]>>('/adminproduct/get-Categories-list').pipe(
      map((res) => {
        if (res.eStatus === Status.Success) return res.data;
        else return this.errorHandler.handleServerUnsuccess(res, null);
      }),
      catchError(this.errorHandler.handleError<CategoryDTO[]>(`دریافت لیست دسته بندی ها`))
    );
  }

  deleteCategory(id: number, deleteChildren?: boolean): Observable<boolean> {
    let params;
    if (deleteChildren !== null){
      params = new HttpParams().set('deleteChildren', deleteChildren);
    }
    console.log(deleteChildren,'delete category params=deleteChildren',params)
    return this.http.get<IResponseResult<any>>('/adminproduct/delete-category/' + id, {params}).pipe(
      map((res) => {
        if (res.eStatus === Status.Success) return true;
        else return this.errorHandler.handleServerUnsuccess(res, false);
      }),
      catchError(this.errorHandler.handleError<boolean>(`حذف دسته :${id}`))
    );
  }
  //#endregion
  //---------------------------------------
  //#region category-attrib
  getCategoryAttribs(catId:number): Observable<Attribs_forCategoryDTO> {
    return this.http.get<IResponseResult<Attribs_forCategoryDTO>>('/adminproduct/category-attribs/' + catId).pipe(
      map(res=>{
        if(res.eStatus===Status.Success) return res.data;
        else return this.errorHandler.handleServerUnsuccess(res,null);
      }),
      catchError(this.errorHandler.handleError<Attribs_forCategoryDTO>(`دریافت ویژگی ها برای کتگوری : ${catId}`))
    );
  }

  categoryAttrib_listChange(catId:number,chosenList:number[]): Observable<boolean>{
    const temp:categoryAttribsChangeDTO={categoryId:catId, attribList:chosenList}
    return this.http.post<IResponseResult<any>>('/adminproduct/category-attribs-list-change',temp)
    .pipe(
      map((res) => {
        if (res.eStatus === Status.Success) return true;          
        else return this.errorHandler.handleServerUnsuccess(res, false);
      }),
      catchError(this.errorHandler.handleError<boolean>(`ثبت تغییرات لیست ویژگی های کتگوری ${catId}`))
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
      if (filter.typeId)
        params = params.append('typeId',filter.typeId);
      if (filter.orderBy)
        params = params.append('orderBy',filter.orderBy);
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
      .post<IResponseResult<AttribDTO>>('/adminproduct/add-attrib-retId', attrib)
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

  deleteAttribList(idList: number[]): Observable<boolean> {
    return this.http.put<IResponseResult<any>>('/adminproduct/delete-attrib-list', idList).pipe(
      map((res) => {
        if (res.eStatus === Status.Success) return true;
        else return this.errorHandler.handleServerUnsuccess(res, false);
      }),
      catchError(this.errorHandler.handleError<boolean>(` حذف ویژگی های:${idList}`))
    );
  }

  getAttribTypes(): Observable<AttribTypeDTO[]> {
    return this.http.get<IResponseResult<AttribTypeDTO[]>>('/adminproduct/get-attrib-types').pipe(
      map((res) => {
        if (res.eStatus === Status.Success) return res.data;
        else return this.errorHandler.handleServerUnsuccess(res, null);
      }),
      catchError(this.errorHandler.handleError<AttribTypeDTO[]>(`دریافت انواع ویژگی`))
    );
  }

  getAttribsList(): Observable<AttribMiniDTO[]> {
    return this.http.get<IResponseResult<AttribMiniDTO[]>>('/adminproduct/get-attrib-list').pipe(
      map((res) => {
        if (res.eStatus === Status.Success) return res.data;
        else return this.errorHandler.handleServerUnsuccess(res, null);
      }),
      catchError(this.errorHandler.handleError<AttribMiniDTO[]>(`دریافت لیست ویژگی ها`))
    );
  }
  //#endregion
//-------------------------  
  //#region attrib-value

  getFilteredAttribValues(filter: ValueDatasourceDTO): Observable<ValueDatasourceDTO> {
    let params;   
    if (filter !== null) {
      params = new HttpParams()
        .set('pageIndex', filter.pageIndex.toString())
        .set('pageSize', filter.pageSize.toString());

      if (filter.text)
        params = params.append('text', filter.text);
      if(filter.attribId)
        params=params.append('attribId',filter.attribId);
      // if(filter.sort)
      //   params = params.append('sort',filter.sort);
    }
    return this.http.get<IResponseResult<ValueDatasourceDTO>>('/adminproduct/filter-attrib-values', { params })
    .pipe(
      map(res=>{
        if(res.eStatus===Status.Success) return res.data;
        else return this.errorHandler.handleServerUnsuccess(res,null);
      }),
      catchError(this.errorHandler.handleError<ValueDatasourceDTO>('دریافت فیلتر مقدار ها'))
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

  /**
   * retrieve value detail and its attrib info by one trip to server
   * @param id 
   * @returns 
   */
  getAttribValueDetail2(id: number): Observable<ValueFullDetailDTO> {
    return this.http
      .get<IResponseResult<ValueFullDetailDTO>>( '/adminproduct/get-attrib-value-detail2/' + id)
      .pipe(
        map((res) => {
          if (res.eStatus === Status.Success) return res.data;
          else return this.errorHandler.handleServerUnsuccess(res, null);
        }),
        catchError(this.errorHandler.handleError<ValueFullDetailDTO>(`دریافت اطلاعات مقدار :${id}`))
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

  deleteAttribValueList(idList: number[]): Observable<boolean> {
    return this.http.put<IResponseResult<any>>('/adminproduct/delete-attrib-value-list', idList).pipe(
      map((res) => {
        if (res.eStatus === Status.Success) return true;
        else return this.errorHandler.handleServerUnsuccess(res, false);
      }),
      catchError(this.errorHandler.handleError<boolean>(`حذف مقدار های:${idList}`))
    );
  }

  getAttribValuesList(id?:number): Observable<ValueDTO[]> {
    return this.http.get<IResponseResult<ValueDTO[]>>('/adminproduct/get-attrib-values-list/' + id).pipe(
      map((res) => {
        if (res.eStatus === Status.Success) return res.data;
        else return this.errorHandler.handleServerUnsuccess(res, null);
      }),
      catchError(this.errorHandler.handleError<ValueDTO[]>(`دریافت لیست مقادیر ویژگی ` + id))
    );
  }
  //#endregion
  //-------------------------------------------------------------------
  //#region gallery

  getProductGalleries(productId: number): Observable<ProductGalleryMiniDTO[]> {
    return this.http.get<IResponseResult<ProductGalleryMiniDTO[]>>('/adminproduct/product-galleries/' + productId)
      .pipe(
        map((res) => {
          if (res.eStatus === Status.Success) return res.data;
          else return this.errorHandler.handleServerUnsuccess(res, null);
        }),
        catchError(this.errorHandler.handleError<ProductGalleryMiniDTO[]>(`دریافت لیست گالری محصول ${productId}`))
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

  getFilteredComments(filter: ProductCommentDatasource): Observable<ProductCommentDatasource> {
    let params = this.generateCommentFilterParams(filter);
    return this.http.get<IResponseResult<ProductCommentDatasource>>('/adminproduct/filter-comments',{ params })
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
    let params:HttpParams;
    if (filter !== null) {
      params = new HttpParams()
        .set('pageIndex', filter.pageIndex)
        .set('pageSize', filter.pageSize);
        
    if(filter.text) params = params.append('text', filter.text)
    if(filter.seenOnly != undefined) params = params.append('seenOnly',filter.seenOnly);
    if(filter.approvedOnly != undefined) params = params.append('approvedOnly',filter.approvedOnly);
    if(filter.productName) params=params.append('productName',filter.productName);
    if(filter.productId) params = params.append('productId', filter.productId);

    // if (filter.sort)
    //   params = params.append('sort', filter.sort);
    }
    console.log('>>>>>> before send to server ds:',filter,'params:',params)
    return params;
  }

  generateParamFilter(filter:any,params:HttpParams,paramName:string): HttpParams {
    if(filter)
      params = params.append(paramName,filter.toString());
    console.log('generateParamFilter>>>>>>>>>>>',filter,params)
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
