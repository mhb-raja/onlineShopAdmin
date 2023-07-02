import { GenericDatasource } from "../common/GenericDatasource";
import { SliderDTO } from "./SliderDTO";

export interface sliderDatasourceDTO extends GenericDatasource<SliderDTO> {
    text?: string;
    activeFromTime?: Date;
    orderBy?: SliderOrderBy;
}

export enum SliderOrderBy{
    ActiveFromAsc = 1,
    ActiveFromDesc = 2,
    TitleAsc = 3,
    TitleDesc = 4,
    ActiveUntilAsc = 5,
    ActiveUntilDesc = 6,
}
