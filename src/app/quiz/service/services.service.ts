import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';

export interface Quiz {
  id: number;
  videoUrl: string;
  category: string;
  pauseTimeInSeconds: number;
  options: string[];
  correctAnswer: string;
  timeLimit: number;
}

export interface QuizAttempt {
  quizId: number;
  email: string;
  selectedAnswer: number;
  timeToAnswer: number;
}

export interface QuizResult {
  isCorrect: boolean;
  correctAnswer: string;
}

export interface QuizStats {
  totalQuestions: number;
  correctAnswers: number;
  averageResponseTime: number;
  score: number;
  totalAttempts: number;
  averageTimeToAnswer: number;
  successRate: number;
}

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private readonly apiUrl = '/api';
  private currentQuizSubject = new BehaviorSubject<Quiz | null>(null);
  private quizStatsSubject = new BehaviorSubject<QuizStats | null>(null);

  constructor(private http: HttpClient) {
  }

  getQuizzes(category?: string): Observable<Quiz[]> {
    let url = `${this.apiUrl}/quizzes`;
    if (category) {
      url += `?category=${category}`;
    }
    return this.http.get<Quiz[]>(url).pipe(
      tap(quizzes => console.log('Fetched quizzes:', quizzes))
    );
  }

  getQuizById(id: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/quiz/${id}`);
  }

  submitQuizAttempt(attempt: QuizAttempt): Observable<QuizResult> {
    return this.http.post<QuizResult>(`${this.apiUrl}/quiz-attempts`, attempt);
  }

  getQuizStats(email: string): Observable<QuizStats> {
    return this.http.get<QuizStats>(`${this.apiUrl}/quiz-stats?email=${email}`);
  }

  setCurrentQuiz(quiz: Quiz) {
    this.currentQuizSubject.next(quiz);
  }

  getCurrentQuiz(): Observable<Quiz | null> {
    return this.currentQuizSubject.asObservable();
  }

  updateQuizStats(stats: QuizStats) {
    this.quizStatsSubject.next(stats);
  }

  getQuizStatsAsObservable(): Observable<QuizStats | null> {
    return this.quizStatsSubject.asObservable();
  }

  updateGameResults(email: string | null, stats: QuizStats): Observable<any> {
    const payload = {
      email: email,
      score: stats.score,
      datePartie: new Date().toISOString(),
      // Ici, on considère averageResponseTime comme le temps moyen de réponse (en ms par exemple)
      tempsMoyenReponse: stats.averageResponseTime*1000,
      // Mapping pour le taux de réussite : on utilise correctAnswers et totalQuestions
      bonnesReponses: stats.correctAnswers,
      totalReponses: stats.totalQuestions
    };

    console.log('Envoi du payload vers /api/update-game:', payload);
    return this.http.post<any>(`${this.apiUrl}/update-game`, payload);
  }
}
