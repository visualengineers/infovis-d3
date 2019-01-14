import { DataPoint } from '@/script/DataPoint';

export interface DataGroup<K extends keyof DataPoint, N extends string, D  = DataPoint> {
  name: N;
  property: K;
  value: DataPoint[K];
  elements: D[];
}
