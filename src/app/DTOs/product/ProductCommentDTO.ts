import { GenericDatasource } from "../common/GenericDatasource";

export interface ProductCommentMiniDTO {
  text: string;
  productId: number;
  parentId?:number;
}

export interface ProductCommentDTO extends ProductCommentMiniDTO {
  id: number;
  userId: number;
  userFullName: string;
  date: Date;
  likeCount:number;
  dislikeCount:number;
}

export interface ProductCommentForAdminDTO extends ProductCommentDTO {
  approved: boolean;
  seenByAdmin: boolean;
  productName: string;
  productImage: string;
}

export interface ProductCommentDatasource extends GenericDatasource<ProductCommentForAdminDTO>
{
    productId?:number;
    text:string;
    onlyNotSeen:boolean;

}

