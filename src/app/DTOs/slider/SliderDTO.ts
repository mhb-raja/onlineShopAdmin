
export class SliderMiniDTO {
    id: number;
    title: string;
    description: string;
    link: string;
    base64Image: string;
}
export class SliderDTO extends SliderMiniDTO {
    activeFrom: Date;
    activeUntil?: Date;
}


