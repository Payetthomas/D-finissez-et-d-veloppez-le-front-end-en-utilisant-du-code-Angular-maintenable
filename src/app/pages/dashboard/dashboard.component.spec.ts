import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Olympic } from '../../models/olympic.model';
import { DataService } from '../../services/data.service';
import { DashboardComponent } from './dashboard.component';

const OLYMPICS: Olympic[] = [
  {
    id: 1,
    country: 'Italy',
    participations: [{ id: 1, year: 2012, city: 'Londres', medalsCount: 28, athleteCount: 372 }],
  },
];

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let component: DashboardComponent;
  let dataService: jasmine.SpyObj<DataService>;

  async function setup(): Promise<void> {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [provideRouter([]), { provide: DataService, useValue: dataService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(() => {
    dataService = jasmine.createSpyObj<DataService>('DataService', [
      'getOlympics',
      'getTotalMedals',
      'getNumberOfJOs',
    ]);
    dataService.getTotalMedals.and.returnValue(28);
    dataService.getNumberOfJOs.and.returnValue(1);
  });

  it('should build the indicators and the country list', async () => {
    dataService.getOlympics.and.returnValue(of(OLYMPICS));
    await setup();

    expect(component.isLoading).toBeFalse();
    expect(component.indicators).toEqual([
      { label: 'Number of countries', value: 1 },
      { label: 'Number of JOs', value: 1 },
    ]);
    expect(component.summaries).toEqual([{ id: 1, country: 'Italy', medals: 28 }]);
  });

  it('should navigate to the country page with its id', async () => {
    dataService.getOlympics.and.returnValue(of(OLYMPICS));
    await setup();
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    component.onCountrySelected(0);

    expect(router.navigate).toHaveBeenCalledWith(['country', 1]);
  });

  it('should display a clear message when loading fails', async () => {
    dataService.getOlympics.and.returnValue(throwError(() => new Error('network')));
    await setup();

    const alert = (fixture.nativeElement as HTMLElement).querySelector('[role="alert"]');
    expect(alert?.textContent).toContain('Unable to load the Olympic data');
  });
});
