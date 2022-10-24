import { GenericDatasource } from "../common/GenericDatasource";
import { SliderDTO } from "./SliderDTO";

export interface sliderDatasourceDTO extends GenericDatasource<SliderDTO> {
    text?: string;
    activeFromTime?: Date;
    sort: string;
}
