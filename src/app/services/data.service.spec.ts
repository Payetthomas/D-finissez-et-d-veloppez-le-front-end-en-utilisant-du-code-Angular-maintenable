import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Olympic } from '../models/olympic.model';
import { DataService } from './data.service';

const OLYMPICS: Olympic[] = [
  {
    id: 1,
    country: 'Italy',
    participations: [
      { id: 1, year: 2012, city: 'Londres', medalsCount: 28, athleteCount: 372 },
      { id: 2, year: 2016, city: 'Rio de Janeiro', medalsCount: 28, athleteCount: 375 },
    ],
  },
  {
    id: 2,
    country: 'Spain',
    participations: [{ id: 1, year: 2020, city: 'Tokyo', medalsCount: 17, athleteCount: 321 }],
  },
];

describe('DataService', () => {
  let service: DataService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DataService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should compute totals and the number of Olympic Games', () => {
    expect(service.getTotalMedals(OLYMPICS[0])).toBe(56);
    expect(service.getTotalAthletes(OLYMPICS[0])).toBe(747);
    expect(service.getNumberOfJOs(OLYMPICS)).toBe(3);
  });

  it('should return the country matching the id', () => {
    let result: Olympic | undefined;
    service.getOlympicById(2).subscribe((olympic) => (result = olympic));
    http.expectOne('./assets/mock/olympic.json').flush(OLYMPICS);
    expect(result?.country).toBe('Spain');
  });

  it('should return undefined for an unknown id', () => {
    let result: Olympic | undefined = OLYMPICS[0];
    service.getOlympicById(99).subscribe((olympic) => (result = olympic));
    http.expectOne('./assets/mock/olympic.json').flush(OLYMPICS);
    expect(result).toBeUndefined();
  });
});
