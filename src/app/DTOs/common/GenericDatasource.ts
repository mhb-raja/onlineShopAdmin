

// export class GenericDatasource<T> {
//     constructor(
//         public items: T[],
//         public paginator: Paginator
//     ) { }
// }

// export abstract class GenericDatasource<T> {
//     items: T[];
//     paginator: Paginator;
// }

export interface GenericDatasource<T> {
    items: T[];
    //paginator: Paginator;
    pageSize: number,
    pageIndex: number,
    totalItems: number
}