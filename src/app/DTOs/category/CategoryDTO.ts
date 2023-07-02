export interface CategoryMiniDTO {
    id: number;
    title: string;
}
// export interface CategoryDTO extends CategoryMiniDTO {

//     urlTitle: string;
//     parentId: number;
// }

// export interface CategoryTreeItemDTO extends CategoryDTO {
//     children?: CategoryTreeItemDTO[];
// }

export interface CategoryDetailDTO extends CategoryDTO {
    parentTitle: string;
}


export interface CategoryDTO extends CategoryMiniDTO {

    urlTitle: string;
    parentId: number;
    expandable?: boolean;
    //children?: CategoryDTO[];
}

                    
                    