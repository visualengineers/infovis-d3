export interface DataPoint {
  Continent: string;
  Region: string;
  'Area Code': string;
  Area: string;
  'Item Code': string;
  Item: string;
  Year: number;
  Unit: string;
  Value: string;
}

export enum ItemCodes {
  ANEMIA_CODE = '21043',
  PROTEIN_CODE = '21013',
  GDP_CODE = '22013',
}
