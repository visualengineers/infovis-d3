import { Component, OnInit, IterableDiffers, DoCheck } from '@angular/core';
import { DataService } from './data/data.service';
import { ICountry } from './data/ICountry';

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

  yearMin:  number;
  yearMax: number;

  constructor(private data: DataService) {
  }

  ngOnInit(): void {
    this.countries = this.data.getCountryList();
    this.years = this.data.getTimeRange();
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

  generateRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

}
