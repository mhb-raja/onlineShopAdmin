import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { IKeyPair } from './common';

export interface IColumnFilter {
  columnDef: string;
  //type: filterType;
  data?: IColumnFilterData; 
  //data?: IColFilterDetail[]; 
}

export interface IColFilterDetail{
  control?: FormControl;
  label?: string;
  value?: any;
  valueType?: string;
  options?: IKeyPair<number|boolean,string>[];//Map<number|boolean,string>; 
  selectMultiple?: boolean;
}

export interface IColumnFilterData {
  type: filterType;
  details:IColFilterDetail[];
  //detail2?:IColFilterDetail;

  // control?: FormControl;
  // label?: string;
  // value: any;
  // list?: Map<number,string>; //Observable<any[]>;
}
export enum ValueTypeEnum{
  number = 1,

}
export enum filterType {
  input = 1,
  select = 2,
  checkbox = 3,
  noFilter_justText = 4,
  noFilter_button = 5,
  //range = 5,
  // totalCount = 3,
  // selectionCheckbox = 4,
}
//------------------------------------
export enum ColumnDataType {
  text = 1,
  image = 2,
  boolean = 3,
  button = 4,
}
interface ColumnDataTypeBase {
  type: ColumnDataType;
}
export interface columnDataType_text<T> extends ColumnDataTypeBase {
  text: (element: T) => string;
}
export interface columnDataType_image<T> extends ColumnDataTypeBase {
  src: (element: T) => string;
  alt?: (element: T) => string;
  class?: (element: T) => string;
}
export interface columnDataType_bool<T> extends ColumnDataTypeBase {
  value: (element: T) => boolean;
  True_icon: (element: T) => string;
  False_icon: (element: T) => string;
  True_class?: (element: T) => string;
  False_class?: (element: T) => string;
}
export interface columnDataType_button<T> extends ColumnDataTypeBase {
  text: (element: T) => string;
  link: (element: T) => string;
  icon?: (element: T) => string;
}
//-----------------------
//IRowClass222<T>:(element:T)=>string;

export interface IRowClass<T>{
  myclass?: (element: T) => string;
}
export interface IColumnDefinition<T> {
  columnDef: string;
  header: string;

  routerLink?: string[];

  cellData_Type?: ColumnDataType;

  cellData_text?: (element: T) => string;

  cellData_img_src?: (element: T) => string;
  cellData_img_alt?: (element: T) => string;
  cellData_img_class?: string;

  cellData_bool_value?: (element: T) => boolean;
  cellData_bool_True_icon?: string;
  cellData_bool_True_class?: string;
  cellData_bool_False_icon?: string;  
  cellData_bool_False_class?: string;
  cellData_bool_null_icon?: string;  
  cellData_bool_null_class?: string;
  cellData_bool_showNull?: boolean;
  

  cellData_btn_text?: string; //(element: T) => string;
  cellData_btn_link?: (element: T) => string;
  cellData_btn_icon?: string; //(element: T) => string;

  //cellData?: (element:T) => columnDataType_text<T>|columnDataType_bool<T>|columnDataType_button<T>|columnDataType_image<T>;
  // cellData?:
  //   | columnDataType_text<T>
  //   | columnDataType_bool<T>
  //   | columnDataType_button<T>
  //   | columnDataType_image<T>;

  filter?: IColumnFilterData;
  sortEnabled?: boolean; // = false;//An interface property cannot have an initializer.
}

//----------------------------------------
export interface IActionButton {
  text?: string;
  action?: string;
  icon?: string;
}

export interface IButtonsColumn {
  singleBtn: IActionButton;
  menu: IActionButton[];
}

//-------------------------------------------

