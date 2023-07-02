import { AttribMiniDTO } from './AttribDTO';

export interface Attribs_forCategoryDTO {
  categoryTitle: string;
  chosen: AttribMiniDTO[];
  otherActiveAttribs: AttribMiniDTO[];
}

export interface categoryAttribsChangeDTO {
  categoryId: number;
  attribList: number[];
}
