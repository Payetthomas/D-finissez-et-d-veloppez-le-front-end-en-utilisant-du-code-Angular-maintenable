import { AfterViewInit, Component, computed, ElementRef, input, OnDestroy, output, viewChild } from '@angular/core';
import Chart from 'chart.js/auto';

const PIE_COLORS = ['#0b868f', '#adc3de', '#7a3c53', '#8f6263', '#ffa500', '#94819d'];

@Component({
  selector: 'app-medals-pie-chart',
  templateUrl: './medals-pie-chart.component.html',
  styleUrls: ['./medals-pie-chart.component.scss'],
})
export class MedalsPieChartComponent implements AfterViewInit, OnDestroy {
  labels = input<string[]>([]);
  values = input<number[]>([]);
  countrySelected = output<number>();

  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('pieCanvas');

  description = computed(
    () =>
      'Medals per country: ' +
      this.labels()
        .map((label, index) => `${label} ${this.values()[index]}`)
        .join(', ')
  );

  private chart?: Chart<'pie', number[], string>;

  ngAfterViewInit(): void {
    this.chart = new Chart(this.canvas().nativeElement, {
      type: 'pie',
      data: {
        labels: this.labels(),
        datasets: [
          {
            label: 'Medals',
            data: this.values(),
            backgroundColor: PIE_COLORS,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
        },
        onClick: (_event, elements) => {
          if (elements.length > 0) {
            this.countrySelected.emit(elements[0].index);
          }
        },
      },
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
