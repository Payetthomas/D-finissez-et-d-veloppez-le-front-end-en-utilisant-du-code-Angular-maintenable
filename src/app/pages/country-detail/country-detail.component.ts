import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Indicator } from '../../models/indicator.model';
import { Participation } from '../../models/participation.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrl: './country-detail.component.scss',
})
export class CountryDetailComponent implements OnInit {
  title = 'Country details';
  indicators: Indicator[] = [];
  participations: Participation[] = [];
  years: number[] = [];
  medals: number[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.dataService.getOlympicById(id).subscribe({
      next: (olympic) => {
        if (!olympic) {
          this.router.navigate(['/not-found']);
          return;
        }

        this.title = olympic.country;
        this.participations = olympic.participations;
        this.years = olympic.participations.map((participation) => participation.year);
        this.medals = olympic.participations.map((participation) => participation.medalsCount);
        this.indicators = [
          { label: 'Number of entries', value: olympic.participations.length },
          { label: 'Total Number of medals', value: this.dataService.getTotalMedals(olympic) },
          { label: 'Total Number of athletes', value: this.dataService.getTotalAthletes(olympic) },
        ];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load the data for this country. Please go back to the dashboard.';
        this.isLoading = false;
      },
    });
  }
}
