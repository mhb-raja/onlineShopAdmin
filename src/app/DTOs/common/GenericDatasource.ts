

// export class GenericDatasource<T> {
//     constructor(
//         public items: T[],
//         public paginator: Paginator
//     ) { }
// }

import { Observable } from "rxjs";
import { AttribDTO } from "../category/AttribDTO";

// export abstract class GenericDatasource<T> {
//     items: T[];
//     paginator: Paginator;
// }

export interface GenericDatasource<T> {
    pageIndex: number,
    pageSize: number,    
    totalItems: number,
    items: T[];
}
