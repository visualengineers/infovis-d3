import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import data from './FAOSTAT_data.json';
import { ICountry } from './ICountry.js';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private data;
  private preparedData;

  constructor(private http: HttpClient) {
    this.data = data;
    // Hack
    const dataString = JSON.stringify(data);
    this.preparedData = this.prepareData(JSON.parse(dataString));
  }

  private groupData(flatData, key, value) {
    const result = [];
    const hierarchy = {};

    flatData.forEach(function (node) {
      hierarchy[node[key]] = node;
    });

    Object.keys(hierarchy).forEach(function (root) {
      const parent = {};
      parent[key] = root;
      parent[value] = [];
      flatData.forEach(function (node) {
        if (node[key] === root) {
          parent[value].push(node);
          delete node[key];
        }
      });
      result.push(parent);
    });

    return result;
  }

  private prepareData(originalData) {
    const groupRegions = this.groupData(originalData, 'Region', 'Countries');
    groupRegions.forEach(region => {
      const groupedCountries = this.groupData(region.Countries, 'Area', 'Years');
      region.Countries = groupedCountries;
      groupedCountries.forEach(country => {
        const groupedYears = this.groupData(country.Years, 'Year', 'Properties');
        country.Years = groupedYears;
      });
    });
    return groupRegions;
  }

  getData() {
    return this.data;
  }

  getPreparedData() {
    return this.preparedData;
  }

  getCountryList(): ICountry[] {
    // TODO use rxjs
    const countries: ICountry[] = [];
    this.getPreparedData().forEach(region => {
      region.Countries.forEach(country => {
        countries.push(
          {
          country: country.Area,
          color: this.generateRandomColor()
        });
      });
    });
    return countries;
  }

  getTimeRange(): number[] {
    const years = [];
    this.getPreparedData()[0].Countries[0].Years.forEach(year => {
      years.push(year.Year);
    });
    return years;
  }

  getValue(country: string, year: string, code: string) {
    let getValueResult;
    this.data.some(item => {
      if (item['Area'] === country && item['Year'] === year && item['Item Code'] === code) {
        getValueResult = item['Value'];
        return true;
      }
    });
    return getValueResult;
  }

  getMaxValue(code: string) {
    let resultMax = 0;
    let country = 'unknown';
    let year = 'unknown';
    this.data.forEach(function (item) {
      const currentValue = Number.parseFloat(item['Value']);
      if (item['Item Code'] === code && resultMax < currentValue) {
        resultMax = currentValue;
        country = item['Area'];
        year = item['Year'];
      }
    });
    return {
      'Value': resultMax,
      'Year': year,
      'Country': country
    };
  }

  getMinValue(code: string) {
    let resultMin = 0;
    let country = 'unknown';
    let year = 'unknown';
    this.data.forEach(function (item) {
      const currentValue = Number.parseFloat(item['Value']);
      if (item['Item Code'] === code && resultMin > currentValue) {
        resultMin = currentValue;
        country = item['Area'];
        year = item['Year'];
      }
    });
    return {
      'Value': resultMin,
      'Year': year,
      'Country': country
    };
  }

  getAverageForRegion(region: string, year: string, code: string) {
    let sumAverage = 0;
    let countAverage = 0;
    this.data.forEach(function (item) {
      if (item['Region'] === region && item['Year'] === year && item['Item Code'] === code && item['Value'] !== undefined) {
        sumAverage += Number.parseFloat(item['Value']);
        countAverage++;
      }
    });
    return sumAverage / countAverage;
  }

  generateRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
}
