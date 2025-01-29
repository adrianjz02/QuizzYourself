import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizGameComponent } from './quiz-game.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { QuizService } from '../service/services.service';
import { AuthService } from '../../auth/services/auth.service';

describe('QuizGameComponent', () => {
  let component: QuizGameComponent;
  let fixture: ComponentFixture<QuizGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatProgressBarModule
      ],
      declarations: [ QuizGameComponent ],
      providers: [ QuizService, AuthService ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(QuizGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
