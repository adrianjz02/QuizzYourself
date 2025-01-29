import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { QuizService, Quiz, QuizStats } from '../service/services.service';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { VideoPlayerComponent } from '../video-player/video-player.component';
import { AnswerOptionsComponent } from '../answer-options/answer-options.component';
import { QuizResultsComponent } from '../quiz-results/quiz-results.component';

@Component({
  selector: 'app-quiz-game',
  templateUrl: './quiz-game.component.html',
  styleUrls: ['./quiz-game.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    VideoPlayerComponent,
    AnswerOptionsComponent,
    QuizResultsComponent
  ]
})
export class QuizGameComponent implements OnInit, OnDestroy {
  @ViewChild('videoPlayer') videoPlayer!: VideoPlayerComponent;
  @ViewChild('answerOptions') answerOptions!: AnswerOptionsComponent;

  currentQuiz: Quiz | null = null;
  currentScore = 0;
  totalQuestions = 0;
  questionsAnswered = 0;
  isQuestionPhase = false;
  isGameOver = false;
  averageResponseTime = 0;
  totalResponseTime = 0;
  private destroy$ = new Subject<void>();
  private userEmail: string | null = null;
  private quizzes: Quiz[] = [];

  constructor(
    private quizService: QuizService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userEmail = this.authService.getUserEmail();
    if (!this.userEmail) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadQuizzes();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadQuizzes() {
    this.quizService.getQuizzes().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (quizzes) => {
        this.quizzes = quizzes;
        this.totalQuestions = quizzes.length;
        if (quizzes.length > 0) {
          this.loadNextQuiz();
        } else {
          console.error('No quizzes available');
          this.router.navigate(['/accueil']);
        }
      },
      error: (error) => {
        console.error('Error loading quizzes:', error);
      }
    });
  }

  private loadNextQuiz() {
    if (this.quizzes.length > this.questionsAnswered) {
      this.currentQuiz = this.quizzes[this.questionsAnswered];
      this.isQuestionPhase = false;
      if (this.answerOptions) {
        this.answerOptions.resetTimer();
      }
    } else {
      this.endGame();
    }
  }

  onVideoPaused() {
    console.log('Video paused event received');
    this.isQuestionPhase = true;
    console.log('Question phase:', this.isQuestionPhase);
  }

  onVideoEnded() {
    console.log('Video ended');
    if (!this.isGameOver) {
      if (this.questionsAnswered < this.totalQuestions) {
        this.loadNextQuiz();
      } else {
        this.endGame();
      }
    }
  }

  onAnswerSelected(selectedIndex: number) {
    if (!this.currentQuiz || !this.userEmail) return;

    const timeToAnswer = this.currentQuiz.timeLimit - (this.answerOptions?.remainingTime || 0);

    const attempt = {
      quizId: this.currentQuiz.id,
      email: this.userEmail,
      selectedAnswer: selectedIndex,
      timeToAnswer: timeToAnswer
    };

    this.quizService.submitQuizAttempt(attempt).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (result) => {
        if (result.isCorrect) {
          this.currentScore++;
        }
        this.totalResponseTime += timeToAnswer;
        this.questionsAnswered++;
        this.averageResponseTime = this.totalResponseTime / this.questionsAnswered;

        if (this.videoPlayer && this.videoPlayer.player) {
          this.videoPlayer.player.playVideo();
        }

        setTimeout(() => {
          if (this.videoPlayer && this.videoPlayer.player) {
            this.videoPlayer.player.pauseVideo();
            if (this.answerOptions) {
              this.answerOptions.showCorrectAnswer();
            }

            setTimeout(() => {
              if (this.questionsAnswered < this.totalQuestions) {
                this.loadNextQuiz();
                if (this.videoPlayer && this.videoPlayer.player) {
                  this.videoPlayer.player.playVideo();
                }
              } else {
                this.endGame();
              }
            }, 3000);
          }
        }, 10000);
      },
      error: (error) => {
        console.error('Error submitting attempt:', error);
      }
    });
  }

  onTimeUp() {
    if (this.currentQuiz) {
      this.onAnswerSelected(-1);
    }
  }

  private endGame() {
    this.isGameOver = true;
    const results: QuizStats = {
      totalQuestions: this.totalQuestions,
      correctAnswers: this.currentScore,
      averageResponseTime: this.averageResponseTime,
      score: this.currentScore,
      totalAttempts: this.questionsAnswered,
      averageTimeToAnswer: this.averageResponseTime,
      successRate: (this.currentScore / this.totalQuestions) * 100
    };
    this.quizService.updateQuizStats(results);
  }
}
