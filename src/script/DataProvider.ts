/**
 * DataProvider module
 */

import { DataGroup } from '@/script/DataGroup';
import { DataPoint } from '@/script/DataPoint';

export class DataProvider {

  /**
   * Load data.
   */
  public static async loadJSON(): Promise<DataProvider> {
    const data = await (await fetch(this.fileName)).json();
    const preparedData = DataProvider.prepareData(data);

    return new DataProvider(data, preparedData);
  }

  private static fileName = 'data/FAOSTAT_data.json';

  private static unique<V>(data: V[]): V[] {
    return [...new Set(data)];
  }

  /**
   * Prepare hierarchical data structure with Regions, Areas, and Years.
   * @return {Object} The hierarchically prepared data.
   */
  private static prepareData(originalData: DataPoint[]): DataGroup[] {
    return Array.from(originalData.reduce((regions, dataPoint) => {
      const areas = regions.get(dataPoint.Region) || new Map();
      const years = areas.get(dataPoint.Area) || new Map();
      const props = areas.get(dataPoint.Year) || [];

      return regions.set(dataPoint.Region,
        areas.set(dataPoint.Area, years.set(Number.parseInt(dataPoint.Year, 10), props.concat(dataPoint))));
    }, new Map<string, Map<string, Map<number, DataPoint[]>>>()))
    .reduce((acc, [region, areas]) =>
      acc.concat(...Array.from(areas).reduce((acc1, [area, years]) =>
        acc1.concat(...Array.from(years)
        .reduce((acc2, [year, values]) => acc2.concat({ year, area, region, values}), [] as DataGroup[])),
        [] as DataGroup[])),
        [] as DataGroup[]);
  }

  constructor(readonly data: DataPoint[], readonly preparedData: DataGroup[]) {
  }

  /**
   * Get a value from the data.
   * @param {string} area - The country in the data.
   * @param {number} year - The year of the parameter.
   * @param {number} code - The numerical code of the parameter (see data source documentation).
   * @return {number} The desired value in the data.
   */
  public getValue(area: DataPoint['Area'],
                  year: DataPoint['Year'],
                  code: DataPoint['Item Code']): DataPoint['Value'] | undefined {
    const item = this.data.find(i => i.Area === area && i.Year === year && i['Item Code'] === code);

    if (item) {
      return item.Value;
    }
  }

  /**
   * Retrieve maximum value for a given parameter.
   * @param {number} code - The numerical code of the parameter (see data source documentation).
   * @return {Object} Result containing value, year, and country.
   */
  public getMaxValue(code: string): DataPoint | undefined {
    return this.data
      .reduce((maxItem, item) =>
        (!maxItem && item['Item Code'] === code) ||
          item['Item Code'] === code && Number.parseFloat(item.Value) > Number.parseFloat(maxItem!.Value)
          ? item
          : maxItem, undefined as DataPoint | undefined);
  }

  /**
   * Computes the average for a region of a specific parameter of a given year
   * @param {string} region - The region in the data.
   * @param {number} year - The year of the parameter.
   * @param {number} code - The numerical code of the parameter (see data source documentation).
   * @return {number} The average value.
   */
  public getAverageForRegion(region: DataPoint['Region'],
                             year: DataPoint['Year'],
                             code: DataPoint['Item Code']): number {
    const filteredData = this.data
      .filter(({ Region, Year, ['Item Code']: Code, Value }) =>
        Region === region
        && Year === year
        && Code === code && Value);

    return filteredData.map(({ Value }) =>
      Number.parseFloat(Value)).reduce((sum, val) => sum + val) / filteredData.length;
  }
}
