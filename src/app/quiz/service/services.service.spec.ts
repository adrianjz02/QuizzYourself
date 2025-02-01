import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Quiz, QuizAttempt, QuizResult, QuizService} from './services.service';

describe('QuizService', () => {
  let service: QuizService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [QuizService]
    });
    service = TestBed.inject(QuizService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch quizzes', () => {
    const mockQuizzes: Quiz[] = [
      {
        id: 1,
        videoUrl: 'test-url',
        category: 'test',
        pauseTimeInSeconds: 10,
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        correctAnswer: 'Option 2',
        timeLimit: 20
      }
    ];

    service.getQuizzes().subscribe(quizzes => {
      expect(quizzes).toEqual(mockQuizzes);
    });

    const req = httpMock.expectOne('/api/quizzes');
    expect(req.request.method).toBe('GET');
    req.flush(mockQuizzes);
  });

  it('should submit quiz attempt and receive result', () => {
    const mockAttempt: QuizAttempt = {
      quizId: 1,
      email: 'test@example.com',
      selectedAnswer: 1,
      timeToAnswer: 15
    };

    const mockResult: QuizResult = {
      isCorrect: true,
      correctAnswer: 'Option 2'
    };

    service.submitQuizAttempt(mockAttempt).subscribe(result => {
      expect(result).toEqual(mockResult);
    });

    const req = httpMock.expectOne('/api/quiz-attempts');
    expect(req.request.method).toBe('GET');
    req.flush(mockResult);
  });

  it('should fetch quiz by ID', () => {
    const mockQuiz: Quiz = {
      id: 1,
      videoUrl: 'test-url',
      category: 'test',
      pauseTimeInSeconds: 10,
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correctAnswer: 'Option 2',
      timeLimit: 20
    };

    service.getQuizById(1).subscribe(quiz => {
      expect(quiz).toEqual(mockQuiz);
    });

    const req = httpMock.expectOne('/api/quiz/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockQuiz);
  });

  it('should get quiz stats', () => {
    const mockEmail = 'test@example.com';
    const mockStats = {
      totalQuestions: 10,
      correctAnswers: 8,
      averageResponseTime: 12.5,
      score: 80,
      totalAttempts: 10,
      averageTimeToAnswer: 12.5,
      successRate: 80
    };

    service.getQuizStats(mockEmail).subscribe(stats => {
      expect(stats).toEqual(mockStats);
    });

    const req = httpMock.expectOne(`/api/quiz-stats?email=${mockEmail}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockStats);
  });
});
