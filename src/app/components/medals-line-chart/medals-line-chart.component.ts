import { AfterViewInit, Component, computed, ElementRef, input, OnDestroy, viewChild } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-medals-line-chart',
  templateUrl: './medals-line-chart.component.html',
  styleUrls: ['./medals-line-chart.component.scss'],
})
export class MedalsLineChartComponent implements AfterViewInit, OnDestroy {
  years = input<number[]>([]);
  medals = input<number[]>([]);

  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('lineCanvas');

  description = computed(
    () =>
      'Medals per edition: ' +
      this.years()
        .map((year, index) => `${year} ${this.medals()[index]}`)
        .join(', ')
  );

  private chart?: Chart<'line', number[], number>;

  ngAfterViewInit(): void {
    this.chart = new Chart(this.canvas().nativeElement, {
      type: 'line',
      data: {
        labels: this.years(),
        datasets: [
          {
            label: 'Medals',
            data: this.medals(),
            borderColor: '#0b868f',
            backgroundColor: '#0b868f',
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          x: { title: { display: true, text: 'Year' } },
          y: { beginAtZero: true, title: { display: true, text: 'Medals' } },
        },
      },
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
