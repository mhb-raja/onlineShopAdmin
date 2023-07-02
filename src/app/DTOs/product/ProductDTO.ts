import { GenericDatasource } from "../common/GenericDatasource";

export interface ProductMiniDTO {
    id: number,
    productName: string,
    price: number,
    base64Image: string,
    isAvailable: boolean,
    categoryTitle?: string,
    urlCodeFa: string,
}

export interface ProductDTO extends ProductMiniDTO {    
    shortDescription: string,
    description: string,
    categoryId: number,
}

export interface productDatasourceDTO extends GenericDatasource<ProductMiniDTO> {
    text?: string;
    startPrice?: number,
    endPrice?: number,
    maxPrice: number,
    availableOnly?:boolean,
    categories?: number[],
    orderBy?: ProductOrderBy
}

export enum ProductOrderBy {
    PriceAsc = 1,
    PriceDesc = 2,
    TitleAsc = 3,
    TitleDesc = 4,
    // CreateDateAsc = 3,
    // CreateDateDesc = 4,

    IsSpecial = 5
}