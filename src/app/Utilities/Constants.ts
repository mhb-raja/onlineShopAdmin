import { IKeyPair } from "../shared/interfaces/common";

export const DefaultPageSize = 20;
export const DefaultPageSizeOptions = [20, 50, 100];

export const ConstMaxLengthText = 100;

const booleanSelectList: IKeyPair<number, string>[] = [{ key:0, value:"خیر" },{ key:1, value:"بله" }]; // OK
