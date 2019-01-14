/**
 * DataProvider module
 */

import { DataGroup } from '@/script/DataGroup';
import { DataHierarchy } from '@/script/DataHierarchy';
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


  /**
   * Make data hierarchical.
   * @param {Object} flatData - The flat data structure.
   * @param {string} groupingKey - The key which is used for the hierarchical transformation.
   * @param {string} groupName - The name of the collection property under which children are stored.
   * @return {Object} The hierarchically prepared data.
   */
  private static groupData<K extends keyof DataPoint, N extends string>(flatData: DataPoint[],
                                                                        groupingKey: K,
                                                                        groupName: N): Array<DataGroup<K, N>> {
    const groupValues = DataProvider.unique(flatData.map(dataPoint => dataPoint[groupingKey]));
    const groups = groupValues.map(value => [
        value,
        flatData.filter(d => d[groupingKey] === value),
      ] as [DataPoint[K], DataPoint[]],
    );

    return groups.map(([value, elements]) => ({
      name: groupName,
      property: groupingKey,
      value,
      elements,
    }));
  }

  private static unique<V>(data: V[]): V[] {
    return [...new Set(data)];
  }

  /**
   * Prepare hierarchical data structure with Regions, Areas, and Years.
   * @return {Object} The hierarchically prepared data.
   */
  private static prepareData(originalData: DataPoint[]): DataHierarchy {
    return DataProvider.groupData(originalData, 'Region', 'Countries')
      .map(regionGroup => ({
        ...regionGroup,
        elements: DataProvider.groupData(regionGroup.elements, 'Area', 'Years')
          .map(areaGroup => ({
            ...areaGroup,
            elements: DataProvider.groupData(areaGroup.elements, 'Year', 'Properties'),
          })),
      }));
  }

  constructor(readonly data: DataPoint[], readonly preparedData: DataHierarchy) {
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
