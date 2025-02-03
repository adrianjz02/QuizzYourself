import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-answer-options',
  templateUrl: './answer-options.component.html',
  styleUrls: ['./answer-options.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule
  ]
})
export class AnswerOptionsComponent implements OnInit, OnDestroy {
  @Input() options: string[] = [];
  @Input() timeLimit: number = 20;
  @Input() disabled: boolean = false;
  @Input() correctAnswer: string = '';
  @Input() pauseTimeInSeconds: number = 0;
  @Output() optionSelected = new EventEmitter<number>();
  @Output() timeUp = new EventEmitter<void>();
  @Output() feedbackShown = new EventEmitter<void>();

  remainingTime: number = 0;
  selectedOptionIndex: number = -1;
  showFeedback: boolean = false;
  answerSelected: boolean = false;
  private timerInterval: any;

  ngOnInit() {
    this.timeLimit = this.timeLimit + this.pauseTimeInSeconds;
    this.startTimer();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  resetTimer() {
    console.log('Resetting timer...');
    this.stopTimer();
    this.remainingTime = this.timeLimit + this.pauseTimeInSeconds; // Reset to full time
    this.startTimer();
    this.showFeedback = false;
    this.selectedOptionIndex = -1;
    this.answerSelected = false;
  }

  private startTimer() {
    this.remainingTime = this.timeLimit + this.pauseTimeInSeconds;
    this.timerInterval = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime <= 0) {
        this.stopTimer();
        this.timeUp.emit();
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  selectOption(index: number) {
    if (!this.disabled && !this.answerSelected && !this.showFeedback && this.remainingTime > 0) {
      this.selectedOptionIndex = index;
      this.answerSelected = true;
      this.stopTimer();
      this.optionSelected.emit(index);
    }
  }

  showCorrectAnswer() {
    this.showFeedback = true;
    setTimeout(() => {
      this.feedbackShown.emit();
    }, 3000);
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['timeLimit'] || changes['pauseTimeInSeconds']) && !changes['timeLimit']?.firstChange) {
      this.resetTimer();
    }
  }
}
