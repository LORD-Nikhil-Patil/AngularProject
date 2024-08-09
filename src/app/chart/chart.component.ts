import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';

import { Exercise } from '../types';
import { D3Service } from '../services/d3.service';

const Exercises: Exercise[] = JSON.parse(
  localStorage.getItem('workouts') || '[]'
).reverse();

interface Workout {
  workoutType: string;
  workoutMinutes: number;
  count: number;
}

interface GroupedWorkouts {
  [userName: string]: Workout[];
}

@Component({
  selector: 'app-chart',
  standalone: true,
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  imports: [CommonModule, MatListModule],
  encapsulation: ViewEncapsulation.None,
})

export class ChartComponent implements OnInit, AfterViewInit {
  data: Workout[] = [{
    workoutType: "Weightlifting",
    workoutMinutes: 147,
    count: 2
}];
  userList: GroupedWorkouts[] = [];
  userKeys: string[] = [];

  @Input() title!: string;

  public chartId;
  private highestValue: number;
  private svg;
  private margin = 40;
  private width;
  private height;

  constructor(private d3: D3Service, private cdRef: ChangeDetectorRef) {
    this.chartId = this.d3.generateId(5);
  }

  ngOnInit(): void {
    // determining highest value
    
    this.userList = this.groupWorkoutsByUser();
    this.userKeys = this.getObjectKeys(this.userList);
    this.data = this.userList[this.userKeys[0]]
    let highestCurrentValue = 0;
    let tableLength = this.data.length;
    this.data.forEach((data, i) => {
      const barValue = Number(data.workoutMinutes);
      if (barValue > highestCurrentValue) {
        highestCurrentValue = barValue;
      }
      if (tableLength == i + 1) {
        this.highestValue = highestCurrentValue;
      }
    });
    this.cdRef.detectChanges();
  }

  ngAfterViewInit(): void {
    this.width = this.chartContainer.nativeElement.offsetWidth;
    this.height = this.chartContainer.nativeElement.offsetHeight;
    this.createSvg();
    this.drawBars(this.data);

    console.log('userList', this.userList, this.userKeys);
  }
  @ViewChild('chartContainer')
  chartContainer: ElementRef;

   handleChartData(key: string): void {
    let filteredData = []
    let highestCurrentValue = 0;
    if (this.userList.hasOwnProperty(key)) {
      filteredData = this.userList[key];
      filteredData.forEach((data, i) => {
        if (highestCurrentValue < data.workoutMinutes) {
          highestCurrentValue = data.workoutMinutes;
        }
      });
      this.highestValue = highestCurrentValue;
      this.svg.selectAll("*").remove();
        this.drawBars(filteredData);
    }
   }

  /**
   * Groups the workout data by user name.
   *
   * @remarks
   * This function iterates through the `Exercises` array and groups the workout data by user name.
   * The user name is normalized by capitalizing the first letter and converting the rest to lowercase.
   * If a user name does not exist in the `groupedData` object, it is added as a key with an empty array as its value.
   * Each workout is then pushed into the corresponding user's array in the `groupedData` object.
   * Finally, the `groupedData` object is returned as an array of objects.
   *
   * @returns {GroupedWorkouts[]} An array of objects, each containing a user name as a key and an array of workouts as its value.
   */

  groupWorkoutsByUser(): GroupedWorkouts[] {
    const groupedData: GroupedWorkouts[] = [];

    Exercises.forEach((workout) => {
      const { userName, workoutType, workoutMinutes, count } = workout;

      // Normalize the userName
      const normalizedUserName =
        userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase();

      if (!groupedData[normalizedUserName]) {
        groupedData[normalizedUserName] = [];
      }

      groupedData[normalizedUserName].push({
        workoutType,
        workoutMinutes,
        count,
      });
    });

    return groupedData;
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  private createSvg(): void {
    this.svg = this.d3.d3
      .select('div#chart')
      .append('svg')
      .attr(
        'viewBox',
        `0 0 ${this.width + this.margin * 2} ${this.height + this.margin * 2}`
      )
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }

  private drawBars(data: any[]): void {
    // Creating X-axis band scale
    const x = this.d3.d3
      .scaleBand()
      .range([0, this.width])
      .domain(data.map((d) => d.workoutType))
      .padding(0.2);

    // Drawing X-axis on the DOM
    this.svg
      .append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(this.d3.d3.axisBottom(x))
      .selectAll('text')
      // .attr('transform', 'translate(-10, 0)rotate(-45)')
      // .style('text-anchor', 'end')
      .style('font-size', '14px');

    // Creaate Y-axis band scale
    const y = this.d3.d3
      .scaleLinear()
      .domain([0, Number(this.highestValue) + 50])
      .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg
      .append('g')
      .call(this.d3.d3.axisLeft(y))
      .selectAll('text')
      .style('font-size', '14px');

    // Create and fill the bars
    this.svg
      .selectAll('bars')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.workoutType))
      .attr('y', (d) => y(d.workoutMinutes))
      .attr('width', x.bandwidth())
      .attr('height', (d) =>
        y(d.workoutMinutes) < this.height ? this.height - y(d.workoutMinutes) : this.height
      ) // this.height
      .attr('fill', "#63adfeb3");

    this.svg
      .selectAll('text.bar')
      .data(data)
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('fill', '#70747a')
      .attr('x', (d) => x(d.workoutType) + 18)
      .attr('y', (d) => y(d.workoutMinutes) - 5)
      .text((d) => Math.round(d.workoutMinutes * 100) / 100);

      this.svg
      .selectAll('line.yGrid')
      .data(y.ticks())
      .enter()
      .append('line')
      .attr('class', 'yGrid')
      .attr('x1', 0)
      .attr('x2', this.width)
      .attr('y1', (d) => y(d))
      .attr('y2', (d) => y(d))
      .attr('stroke', '#d9d9d9')
      .attr('stroke-width', 0.5)
  }
}
