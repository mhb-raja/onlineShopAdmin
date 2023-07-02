import { GenericDatasource } from "../common/GenericDatasource";

export interface ValueDTO{
  id: number;
  title: string;
  attribId: number;
}

export interface ValueFullDetailDTO extends ValueDTO{
  attribTitle: string;
  attribType: string;
}

export interface ValueDatasourceDTO extends GenericDatasource<ValueDTO>{
  text?: string;
  attribId?:number;
  attribTitle:string;
  attribType:string
}