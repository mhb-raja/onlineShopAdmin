import { GenericDatasource } from '../common/GenericDatasource';

export interface ProductCommentMiniDTO {
  text: string;
  productId: number;
  parentId?: number;
}

export interface ProductCommentDTO extends ProductCommentMiniDTO {
  id: number;
  userId: number;
  userFullName: string;
  date: Date;
  likeCount: number;
  dislikeCount: number;
}

export interface ProductCommentForAdminDTO extends ProductCommentDTO {
  approved: boolean;
  seenByAdmin: boolean;
  productName: string;
  productImage: string;
}

export interface ProductCommentDatasource extends GenericDatasource<ProductCommentForAdminDTO> {
  productId?: number;
  text: string;
  seenOnly?: boolean;
  approvedOnly?: boolean;
  productName: string;
  orderBy?: ProductCommentOrderBy;
}

export enum ProductCommentOrderBy {
  ProductNameAsc = 1,
  ProductNameDesc = 2,
  DateAsc = 3,
  DateDesc = 4,
  UsernameAsc = 5,
  UsernameDesc = 6,
}
