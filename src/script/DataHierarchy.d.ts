import { DataGroup } from '@/script/DataGroup';
import { DataPoint } from '@/script/DataPoint';

export type DataHierarchy = RegionHierarchy[];
export type RegionHierarchy = DataGroup<'Region', 'Countries', AreaHierarchy>;
export type AreaHierarchy = DataGroup<'Area', 'Years', YearHierarchy>;
export type YearHierarchy = DataGroup<'Year', 'Properties', DataPoint>;
