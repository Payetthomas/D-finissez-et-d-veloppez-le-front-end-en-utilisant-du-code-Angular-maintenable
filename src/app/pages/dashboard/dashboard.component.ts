import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { CountrySummary } from '../../models/country-summary.model';
import { Indicator } from '../../models/indicator.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  title = 'Medals per Country';
  indicators: Indicator[] = [];
  summaries: CountrySummary[] = [];
  countries: string[] = [];
  medals: number[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private dataService: DataService,
    private router: Router,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.dataService
      .getOlympics()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (olympics) => {
          this.summaries = olympics.map((olympic) => ({
            id: olympic.id,
            country: olympic.country,
            medals: this.dataService.getTotalMedals(olympic),
          }));
          this.countries = this.summaries.map((summary) => summary.country);
          this.medals = this.summaries.map((summary) => summary.medals);
          this.indicators = [
            { label: 'Number of countries', value: olympics.length },
            { label: 'Number of JOs', value: this.dataService.getNumberOfJOs(olympics) },
          ];
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'Unable to load the Olympic data. Please try again.';
          this.isLoading = false;
        },
      });
  }

  onCountrySelected(index: number): void {
    const summary = this.summaries[index];
    if (summary) {
      this.router.navigate(['country', summary.id]);
    }
  }
}
