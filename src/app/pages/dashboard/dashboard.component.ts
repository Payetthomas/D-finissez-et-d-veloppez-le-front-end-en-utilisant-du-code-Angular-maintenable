import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Indicator } from '../../models/indicator.model';
import { Olympic } from '../../models/olympic.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  title = 'Medals per Country';
  indicators: Indicator[] = [];
  countries: string[] = [];
  medals: number[] = [];
  errorMessage = '';

  private olympics: Olympic[] = [];

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.dataService.getOlympics().subscribe({
      next: (olympics) => {
        this.olympics = olympics;
        this.countries = olympics.map((olympic) => olympic.country);
        this.medals = olympics.map((olympic) => this.dataService.getTotalMedals(olympic));
        this.indicators = [
          { label: 'Number of countries', value: olympics.length },
          { label: 'Number of JOs', value: this.dataService.getNumberOfJOs(olympics) },
        ];
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.message;
      },
    });
  }

  onCountrySelected(index: number): void {
    const olympic = this.olympics[index];
    if (olympic) {
      this.router.navigate(['country', olympic.id]);
    }
  }
}