import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

export interface QuizResults {
  totalQuestions: number;
  correctAnswers: number;
  averageResponseTime: number;
  score: number;
  totalAttempts: number;
  averageTimeToAnswer: number;
  successRate: number;
}

@Component({
  selector: 'app-quiz-results',
  templateUrl: './quiz-results.component.html',
  styleUrls: ['./quiz-results.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class QuizResultsComponent {
  @Input() results!: QuizResults;

  constructor(private router: Router) {}

  get successRate(): number {
    return (this.results.correctAnswers / this.results.totalQuestions) * 100;
  }

  get formattedAverageTime(): string {
    return `${this.results.averageResponseTime.toFixed(2)} seconds`;
  }

  playAgain() {
    this.router.navigate(['/quiz-game']);
  }

  goToHome() {
    this.router.navigate(['/accueil']);
  }
}
