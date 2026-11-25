import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedalsLineChartComponent } from './medals-line-chart.component';

describe('MedalsLineChartComponent', () => {
  let component: MedalsLineChartComponent;
  let fixture: ComponentFixture<MedalsLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedalsLineChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedalsLineChartComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('years', [2012, 2016]);
    fixture.componentRef.setInput('medals', [28, 40]);
    fixture.detectChanges();
  });

  it('should describe the data for screen readers', () => {
    expect(component.description()).toBe('Medals per edition: 2012 28, 2016 40');
  });
});
