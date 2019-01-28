import { Component, Input, OnInit, IterableDiffers, DoCheck } from '@angular/core';
import { select, scaleLinear, axisLeft, axisBottom } from 'd3';
import { DataService } from '../data/data.service';
import { ICountry } from '../data/ICountry';
import { IItem } from '../data/IItem';

@Component({
  selector: 'app-diagramm',
  templateUrl: './diagramm.component.html',
  styleUrls: ['./diagramm.component.css']
})
export class DiagrammComponent implements OnInit, DoCheck {
  @Input() width: number;
  @Input() height: number;
  @Input() padding: number;

  @Input() pointId: number;
  @Input() pointLegend: string;
  @Input() countries: ICountry[];

  xScale: any;
  yScale: any;
  tip: any;

  generated: boolean;
  noData: boolean;
  iterableDiffer;

  previousCountries: ICountry[];

  // proper change detection for changing input values
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

  private _xAxis: IItem;
  @Input() set xAxis(value: IItem) {
    this._xAxis = value;
    if (value && this.generated) {
      this.updateData();
    }
  }

  get xAxis(): IItem {
    return this._xAxis;
  }

  private _yAxis: IItem;
  @Input() set yAxis(value: IItem) {
    this._yAxis = value;
    if (value && this.generated) {
      this.updateData();
    }
  }

  get yAxis(): IItem {
    return this._yAxis;
  }

  constructor(private data: DataService, private _iterableDiffers: IterableDiffers) {
    // see ngDoCheck()
    this.iterableDiffer = this._iterableDiffers.find([]).create(null);
  }

  // check for changes of countries - workaround for angular sufficiency
  ngDoCheck() {
    const changes = this.iterableDiffer.diff(this.countries);
    if (changes) {
      this.updateData();
    }
  }

  ngOnInit(): void {
    // create scales for correct value positioning
    this.yScale = scaleLinear()
      .domain([0, this.data.getMaxValue(this.yAxis.id).Value])
      .range([this.height - (this.padding * 2), 0]);

    this.xScale = scaleLinear()
      .domain([this.data.getMaxValue(this.xAxis.id).Value, 0])
      .range([this.width - (this.padding * 2), 0]);

    this.generateDiagramm();
  }

  // update data on changes
  updateData() {
    select('#yAxis').remove();
    select('#diagramm')
      .append('text')
      .text(this.yAxis.legend)
      .attr('id', 'yAxis');

    select('#xAxis').remove();
    select('#diagramm')
      .append('text')
      .text(this.xAxis.legend)
      .attr('id', 'xAxis')
      .attr('x', this.width / 2)
      .attr('y', this.height - 50);

    // update year
    this.addYearToDiagramm();
    // remove all old data like info labels and unselected values
    if (this.previousCountries && this.previousCountries.length > this.countries.length) {
      this.previousCountries.forEach(country => {
        select(`#info_${this.cleanCountryName(country)}`).remove();
      });

      const remove = this.previousCountries.filter(e => !this.countries.includes(e));
      remove.forEach(country => {
        select(`#circle_${this.cleanCountryName(country)}`).remove();
      });
    }
    // save current countries for next update -- diff
    this.previousCountries = [...this.countries];

    // multiplicator for text position
    let failureCount = 0;

    this.countries.forEach(country => {
      // show info if not enough data is available
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
        // check if circle already exists
        if (selection.empty()) {
          // create new circle
          select('#circles')
            .append('circle')
            .attr('id', `circle_${this.cleanCountryName(country)}`)
            .attr('cx', this.xScale(this.getX(country)))
            .attr('cy', this.yScale(this.getY(country)))
            .attr('fill', country.color)
            .attr('r', this.getPointRadius(country))
            .attr('opacity', 0.50)
            .on('mouseover', () => this.showPointValue(country))
            .on('mouseout', () => this.removePointValue(country));
        } else {
          // update with transition
          select(`#circle_${this.cleanCountryName(country)}`)
            .transition()
            .attr('cx', this.xScale(this.getX(country)))
            .attr('cy', this.yScale(this.getY(country)))
            .attr('r', this.getPointRadius(country));
        }
      }
    });
  }

  generateDiagramm() {
    // set bounds
    select('#diagrammFrame')
      .attr('height', this.height)
      .attr('width', this.width);

    // add padding
    select('#diagramm')
      .attr('transform', `translate(${this.padding}, ${this.padding})`);

    // add year
    this.addYearToDiagramm();

    // y-axis
    select('#diagramm')
      .append('g')
      .call(axisLeft(this.yScale));

    select('#diagramm')
      .append('text')
      .text(this.yAxis.legend)
      .attr('id', 'yAxis');

    // x-axis
    select('#diagramm')
      .append('g')
      .call(axisBottom(this.xScale))
      .attr('transform', `translate(0, ${this.height - (this.padding * 2)})`);

    select('#diagramm')
      .append('text')
      .text(this.xAxis.legend)
      .attr('id', 'xAxis')
      .attr('x', this.width / 2)
      .attr('y', this.height - 50);

    // point size legend
    select('#diagramm')
    .append('text')
    .text(`Point-size: ${this.pointLegend}`)
    .attr('id', 'pointSize')
    .attr('x', this.width / 2);

    // create circle group
    const circles = select('#diagramm')
      .append('g')
      .attr('id', 'circles');

    // create circles
    this.createCircles(circles, this.countries);

    // set generated flag to prevent update before creation
    this.generated = true;
  }

  // add year
  addYearToDiagramm() {
    select('#year').remove();
    select('#diagramm')
      .append('text')
      .attr('id', 'year')
      .text(this.year)
      .attr('x', this.width * (7 / 8))
      .attr('y', 40)
      .attr('font-size', 30);
  }

  // Create cirles for all selected countries
  createCircles(circles, countries: ICountry[]): void {
    circles
      .selectAll('circle')
      .data(countries)
      .enter()
      .append('circle')
      .attr('id', d => 'circle_' + this.cleanCountryName(d))
      .attr('cx', d => this.xScale(this.getX(d)))
      .attr('cy', d => this.yScale(this.getY(d)))
      .attr('fill', d => d.color)
      .attr('r', d => this.getPointRadius(d))
      .attr('opacity', 0.50)
      .on('mouseover', d => this.showPointValue(d))
      .on('mouseout', d => this.removePointValue(d));
  }

  showPointValue(country: ICountry) {
    select('#diagramm')
      .append('text')
      .attr('id', `value_${this.cleanCountryName(country)}`)
      .text(`${this.getPointValue(country)}`)
      .attr('x', this.xScale(this.getX(country)) - 15)
      .attr('y', this.yScale(this.getY(country)));

      select('#diagramm')
      .append('text')
      .attr('id', `legend_${this.cleanCountryName(country)}`)
      .text(`${this.shortenText(country.country)}`)
      .attr('x', this.xScale(this.getX(country)) - 30)
      .attr('y', this.yScale(this.getY(country)) + 20);
  }

  removePointValue(country: ICountry) {
    select(`#value_${this.cleanCountryName(country)}`).remove();
    select(`#legend_${this.cleanCountryName(country)}`).remove();
  }

  // get value for x-axis
  getX(item: ICountry) {
    return this.data.getValue(item.country, this.year.toString(), this.xAxis.id);
  }

  // get value for y-axis
  getY(item: ICountry) {
    return this.data.getValue(item.country, this.year.toString(), this.yAxis.id);
  }

  // get value for point size
  getPointRadius(item: ICountry) {
    return (Number.parseFloat(this.data.getValue(item.country, this.year.toString(), this.pointId.toString())) + 4) * 10;
  }

  getPointValue(item: ICountry) {
    return this.data.getValue(item.country, this.year.toString(), this.pointId.toString());
  }

  // remove special characters from strings to prevent broken id's
  cleanCountryName(item: ICountry) {
    return item.country.replace(/[^a-zA-Z]/g, '');
  }

  shortenText(value: string): string {
    return value.length > 7 ? value.substr(0, 6) + '..' : value;
  }
}
