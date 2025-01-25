import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LineChartEvolutionScoresComponent} from './line-chart-evolution-scores.component';

describe('LineChartEvolutionScoresComponent', () => {
  let component: LineChartEvolutionScoresComponent;
  let fixture: ComponentFixture<LineChartEvolutionScoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineChartEvolutionScoresComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LineChartEvolutionScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
