import { GenericDatasource } from "../common/GenericDatasource";

export interface ProductDTO {
    id: number,
    productName: string,
    urlCodeFa: string,
    price: number,
    shortDescription: string,
    description: string,
    base64Image: string,
    isAvailable: boolean,
    categoryId: number,
    categoryTitle?: string
}

export interface productDatasourceDTO extends GenericDatasource<ProductDTO> {
    text: string;
    startPrice: number,
    endPrice: number,
    maxPrice: number,
    availableOnly:boolean,
    categories: number[],
    orderBy: ProductOrderBy
}

export enum ProductOrderBy {
    PriceAsc = 1,
    PriceDesc = 2,
    CreateDateAsc = 3,
    CreateDateDesc = 4,
    IsSpecial = 5
}