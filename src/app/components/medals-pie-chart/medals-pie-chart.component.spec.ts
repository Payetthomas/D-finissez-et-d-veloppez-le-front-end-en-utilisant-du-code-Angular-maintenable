import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedalsPieChartComponent } from './medals-pie-chart.component';

describe('MedalsPieChartComponent', () => {
  let component: MedalsPieChartComponent;
  let fixture: ComponentFixture<MedalsPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedalsPieChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedalsPieChartComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('labels', ['Italy', 'Spain']);
    fixture.componentRef.setInput('values', [96, 54]);
    fixture.detectChanges();
  });

  it('should describe the data for screen readers', () => {
    expect(component.description()).toBe('Medals per country: Italy 96, Spain 54');
    const canvas = (fixture.nativeElement as HTMLElement).querySelector('canvas');
    expect(canvas?.getAttribute('aria-label')).toBe('Medals per country: Italy 96, Spain 54');
  });
});
