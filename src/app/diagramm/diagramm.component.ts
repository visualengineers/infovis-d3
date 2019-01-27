import { Component, Input, OnInit, IterableDiffers, DoCheck } from '@angular/core';
import { select, selectAll, scaleLinear, axisLeft, axisBottom, AxisScale } from 'd3';
import { DataService } from '../data/data.service';
import { ICountry } from '../data/ICountry';

@Component({
  selector: 'app-diagramm',
  templateUrl: './diagramm.component.html',
  styleUrls: ['./diagramm.component.css']
})
export class DiagrammComponent implements OnInit, DoCheck {
  @Input() width: number;
  @Input() height: number;
  @Input() padding: number;

  @Input() xScaleId: number;
  @Input() yScaleId: number;
  @Input() pointId: number;
  @Input() countries: ICountry[];

  xScale: any;
  yScale: any;

  generated: boolean;
  noData: boolean;
  iterableDiffer;

  previousCountries: ICountry[];

  private _year: number;
  @Input() set year(value: number) {
    this._year = value;
    if (value && this.generated) {
      this.updateData();
    }
  }

  get year(): number {
    return this._year;
  }

  /*
  private _countries: ICountry[];
  @Input() set countries(value: ICountry[]) {
    this._countries = value;
    if (value && this.generated) {
      this.updateData();
    }
  }

  get countries(): ICountry[] {
    return this._countries;
  }
  */

  constructor(private data: DataService, private _iterableDiffers: IterableDiffers) {
    this.iterableDiffer = this._iterableDiffers.find([]).create(null);
  }

  ngDoCheck() {
    const changes = this.iterableDiffer.diff(this.countries);
    if (changes) {
      this.updateData();
    }
  }

  ngOnInit(): void {
    this.yScale = scaleLinear()
      .domain([0, this.data.getMaxValue(this.yScaleId.toString()).Value])
      .range([this.height - (this.padding * 2), 0]);

    this.xScale = scaleLinear()
      .domain([this.data.getMaxValue(this.xScaleId.toString()).Value, 0])
      .range([this.width - (this.padding * 2), 0]);
    this.generateDiagramm();
  }

  updateData() {

    if (this.previousCountries && this.previousCountries.length > this.countries.length) {
      this.previousCountries.forEach(country => {
        select(`#info_${this.cleanCountryName(country)}`).remove();
      });

      const remove = this.previousCountries.filter(e => !this.countries.includes(e));

      remove.forEach(country => {
        select(`#circle_${this.cleanCountryName(country)}`).remove();
      });
    }

    this.previousCountries = [...this.countries];

    let failureCount = 0;

    this.countries.forEach(country => {
      if (this.getX(country) === undefined || this.getY(country) === undefined) {
        select(`#circle_${this.cleanCountryName(country)}`).remove();
        select(`#info_${this.cleanCountryName(country)}`).remove();
        select('#diagramm')
          .append('text')
          .text(`No Data for ${country.country}`)
          .attr('id', `info_${this.cleanCountryName(country)}`)
          .attr('x', 20)
          .attr('y', 40 + (20 * failureCount));
        failureCount++;
      } else {
        select(`#info_${this.cleanCountryName(country)}`).remove();
        const selection = select(`#circle_${this.cleanCountryName(country)}`);
        if (selection.empty()) {
          select('#circles')
            .append('circle')
            .attr('id', `circle_${this.cleanCountryName(country)}`)
            .attr('cx', this.xScale(this.getX(country)))
            .attr('cy', this.yScale(this.getY(country)))
            .attr('fill', country.color)
            .attr('r', this.getPoint(country))
            .attr('opacity', 0.50);
        } else {
          select(`#circle_${this.cleanCountryName(country)}`)
            .transition()
            .attr('cx', this.xScale(this.getX(country)))
            .attr('cy', this.yScale(this.getY(country)))
            .attr('r', this.getPoint(country));
        }
      }
    });
  }

  generateDiagramm() {
    // set bounds
    select('#diagrammFrame')
      .attr('height', this.height)
      .attr('width', this.width);

    select('#diagramm')
      .append('text')
      .text('Prevalence of obesity in the adult population (18 years and older)')
      .attr('id', 'yAxis');

    select('#diagramm')
      .append('text')
      .text('Percentage of population using safely managed drinking water services (Percent)')
      .attr('id', 'xAxis')
      .attr('x', this.width / 2)
      .attr('y', this.height - 50);

    select('#diagramm')
      .attr('transform', `translate(${this.padding}, ${this.padding})`);

    select('#diagramm')
      .append('g')
      .call(axisLeft(this.yScale));

    select('#diagramm')
      .append('g')
      .call(axisBottom(this.xScale))
      .attr('transform', `translate(0, ${this.height - (this.padding * 2)})`);

    const circles = select('#diagramm')
      .append('g')
      .attr('id', 'circles');

    circles
      .selectAll('circle')
      .data(this.countries)
      .enter()
      .append('circle')
      .attr('id', d => 'circle_' + this.cleanCountryName(d))
      .attr('cx', d => this.xScale(this.getX(d)))
      .attr('cy', d => this.yScale(this.getY(d)))
      .attr('fill', d => d.color)
      .attr('r', d => this.getPoint(d))
      .attr('opacity', 0.50);

    this.generated = true;
  }

  getX(item: ICountry) {
    return this.data.getValue(item.country, this.year.toString(), this.xScaleId.toString());
  }

  getY(item: ICountry) {
    return this.data.getValue(item.country, this.year.toString(), this.yScaleId.toString());
  }

  getPoint(item: ICountry) {
    return (Number.parseFloat(this.data.getValue(item.country, this.year.toString(), this.pointId.toString())) + 4) * 10;
  }

  cleanCountryName(item: ICountry) {
    return item.country.replace(/[^a-zA-Z]/g, '');
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
