import { DataGroup } from '@/script/DataGroup';

export type DataHierarchy = DataGroup<'Region', 'Countries', DataGroup<'Area', 'Years', DataGroup<'Year', 'Properties'>>>[];