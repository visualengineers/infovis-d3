import { DataPoint } from "./DataPoint";

export interface DataGroup {
    year: number;
    region: string;
    area: string;
    values: Array<DataPoint>;
}