import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { Olympic } from '../../models/olympic.model';
import { DataService } from '../../services/data.service';
import { CountryDetailComponent } from './country-detail.component';

const ITALY: Olympic = {
  id: 1,
  country: 'Italy',
  participations: [
    { id: 1, year: 2012, city: 'Londres', medalsCount: 28, athleteCount: 372 },
    { id: 2, year: 2016, city: 'Rio de Janeiro', medalsCount: 28, athleteCount: 375 },
  ],
};

describe('CountryDetailComponent', () => {
  let fixture: ComponentFixture<CountryDetailComponent>;
  let component: CountryDetailComponent;
  let dataService: jasmine.SpyObj<DataService>;

  async function setup(id: string, olympic: Olympic | undefined): Promise<Router> {
    dataService = jasmine.createSpyObj<DataService>('DataService', [
      'getOlympicById',
      'getTotalMedals',
      'getTotalAthletes',
    ]);
    dataService.getOlympicById.and.returnValue(of(olympic));
    dataService.getTotalMedals.and.returnValue(56);
    dataService.getTotalAthletes.and.returnValue(747);

    await TestBed.configureTestingModule({
      declarations: [CountryDetailComponent],
      providers: [
        provideRouter([]),
        { provide: DataService, useValue: dataService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id }) } } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture = TestBed.createComponent(CountryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    return router;
  }

  it('should display the key figures of the country', async () => {
    await setup('1', ITALY);

    expect(dataService.getOlympicById).toHaveBeenCalledWith(1);
    expect(component.title).toBe('Italy');
    expect(component.years).toEqual([2012, 2016]);
    expect(component.medals).toEqual([28, 28]);
    expect(component.indicators.map((indicator) => indicator.value)).toEqual([2, 56, 747]);
  });

  it('should redirect to not-found when the country does not exist', async () => {
    const router = await setup('abc', undefined);

    expect(router.navigate).toHaveBeenCalledWith(['/not-found']);
  });
});
