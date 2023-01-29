import { GenericDatasource } from "../common/GenericDatasource";

export interface ValueDTO{
    id: number;
    title: string;
    attribId: number;
  }

  export interface ValueDatasource extends GenericDatasource<ValueDTO>{
    text?: string;
    AttribId?:number
  }