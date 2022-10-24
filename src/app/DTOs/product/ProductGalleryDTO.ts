export interface ProductGalleryMiniDTO{
    id: number,    
    imageName: string
}

export interface ProductGalleryDTO extends ProductGalleryMiniDTO{
    productId: number,
}