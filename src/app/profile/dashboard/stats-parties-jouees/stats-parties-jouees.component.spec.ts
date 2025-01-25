import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsPartiesJoueesComponent } from './stats-parties-jouees.component';

describe('StatsPartiesJoueesComponent', () => {
  let component: StatsPartiesJoueesComponent;
  let fixture: ComponentFixture<StatsPartiesJoueesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsPartiesJoueesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsPartiesJoueesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
