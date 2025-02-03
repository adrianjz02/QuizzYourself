import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PieChartTauxReussiteComponent} from './pie-chart-taux-reussite.component';

describe('PieChartTauxReussiteComponent', () => {
  let component: PieChartTauxReussiteComponent;
  let fixture: ComponentFixture<PieChartTauxReussiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieChartTauxReussiteComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PieChartTauxReussiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
