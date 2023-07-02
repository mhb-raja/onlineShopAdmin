import { GenericDatasource } from '../common/GenericDatasource';

export interface AttribMiniDTO {
  id: number;
  title: string;
  typeId: number;
}
export interface AttribDTO extends AttribMiniDTO {
  type?: string;
  valuesCount?: number;
}

export interface AttribDatasourceDTO extends GenericDatasource<AttribDTO> {
  text?: string;
  typeId?: number;
  orderBy?: AttribOrderBy;
  //needValues:boolean;
}

export enum AttribOrderBy {
  TitleAsc = 1,
  TitleDesc = 2,
  valuesCountAsc = 3,
  valuesCountDesc = 4,
  typeAsc = 5,
  typeDesc = 6
}

//-------------------------------------------
export interface AttribTypeDTO {
  id: number;
  title: string;
  title_Fa: string;
}

export enum AttribTypeEnum {
  TypeString = 1,
  TypeBool = 2,
  TypeNumber = 3,
}
