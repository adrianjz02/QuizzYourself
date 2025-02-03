import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BarChartTempsReponseComponent} from './bar-chart-temps-reponse.component';

describe('BarChartTempsReponseComponent', () => {
  let component: BarChartTempsReponseComponent;
  let fixture: ComponentFixture<BarChartTempsReponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarChartTempsReponseComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BarChartTempsReponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
