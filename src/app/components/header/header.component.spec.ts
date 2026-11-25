import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
  });

  it('should display the title and one item per indicator', () => {
    fixture.componentRef.setInput('title', 'Medals per Country');
    fixture.componentRef.setInput('indicators', [
      { label: 'Number of countries', value: 5 },
      { label: 'Number of JOs', value: 3 },
    ]);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h1')?.textContent).toContain('Medals per Country');
    expect(element.querySelectorAll('.indicator').length).toBe(2);
  });
});
