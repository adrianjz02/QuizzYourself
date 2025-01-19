import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizMainComponent } from './quiz-main.component';

describe('QuizMainComponent', () => {
  let component: QuizMainComponent;
  let fixture: ComponentFixture<QuizMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
