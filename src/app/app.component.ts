import { Component, OnInit, IterableDiffers, DoCheck } from '@angular/core';
import { DataService } from './data/data.service';
import { ICountry } from './data/ICountry';
import { IItem } from './data/IItem';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  countries: ICountry[];
  selectedCountry: ICountry;
  selectedCountries: ICountry[];
  years: number[];
  year: number;
  yItems: IItem[];
  xItems: IItem[];

  xAxis: IItem;
  yAxis: IItem;

  yearMin: number;
  yearMax: number;

  constructor(private data: DataService) {
  }

  ngOnInit(): void {
    this.countries = this.data.getCountryList();
    this.years = this.data.getTimeRange();
    this.xItems = this.data.getItemList();
    this.xAxis = this.xItems.find(item => item.id === '21013');
    this.yItems = this.data.getItemList();
    this.yAxis = this.yItems.find(item => item.id === '21042');
    this.year = 2000;
    this.yearMin = Math.min(...this.years);
    this.yearMax = Math.max(...this.years);
    this.selectedCountries = [this.countries.find(country => country.country === 'Germany')];
  }

  updateList(value: ICountry) {
    if (this.selectedCountries.includes(value)) {
      const index = this.selectedCountries.indexOf(value);
      this.selectedCountries.splice(index, 1);
    } else {
      this.selectedCountries.push(value);
    }
  }

  xChanged(value: IItem) {
    if (value !== this.yAxis) {
      this.xAxis = value;
    }
  }

  yChanged(value: IItem) {
    if (value !== this.xAxis) {
      this.yAxis = value;
    }
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
