import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {GameService} from '../game.service';
import {Question} from '../../core/models/question';
import { first } from 'rxjs/operators';
import {GameData} from '../../core/models/game-data';
import {ActivatedRoute} from '@angular/router';
import {OptionCardComponent} from '../option-card/option-card.component';
import {Observable} from 'rxjs';
import {NUM_OF_QUESTIONS} from '../../core/constants/global';
import {LeaderboardService} from '../../leaderboard/leaderboard.service';
import {LeaderboardRecord} from '../../core/models/leaderboard-record';

@Component({
  selector: 'app-game-screen',
  templateUrl: './game-screen.component.html',
  styleUrls: ['./game-screen.component.css']
})
export class GameScreenComponent implements OnInit {
  private readonly SECONDS_PER_QUESTION = 20;

  @ViewChildren(OptionCardComponent) options: QueryList<OptionCardComponent>;
  timeLeft: number;
  interval: any;
  username: string;
  questionNumberCounter = 1;
  currentQuestion$: Question;
  possibleAnswers: string[];
  answerChosen = '';
  answerSubmitted = false;
  disableSkipButton = false;
  endOfGame = false;

  constructor(private gameService: GameService,
              private leaderboardService: LeaderboardService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.username = this.activatedRoute.snapshot.paramMap.get('username');

    this.gameService.getQuestions().pipe(first()).subscribe(data => {
      this.gameService.setStartGameData(new GameData(this.username, data));
      this.getCurrentQuestionData();
    }, () => window.alert('Something went wrong! Check your internet connection'));
    this.startTimer();
  }

  private startTimer(): void {
    this.timeLeft = this.SECONDS_PER_QUESTION;
    this.interval = setInterval(() => {
      this.timeLeft > 0 ? this.timeLeft-- : this.onTimerEnded();
      }, 1000);
  }

  private onTimerEnded(): void {
    this.stopTimer();
    this.handleDecrementLife();
    this.disableSkipButton = true;
    this.options.forEach(option => option.isCardDisabled = true);
  }

  getCurrentQuestionData(): void {
    this.gameService.getQuestionByIndex(this.questionNumberCounter - 1).pipe(first()).subscribe(question => {
      this.currentQuestion$ = question;
      this.possibleAnswers = this.randomizeAnswersOrder();
    });
  }

  private randomizeAnswersOrder(): string[] {
    const randomizedAnswersOrder = [...this.currentQuestion$.incorrectAnswers, this.currentQuestion$.correctAnswer];
    randomizedAnswersOrder.sort(() => Math.random() - 0.5);
    return randomizedAnswersOrder;
  }

  onAnswerSubmitted(): void {
    this.stopTimer();
    this.answerSubmitted = true;
    this.isCorrectAnswer() ? this.gameService.increaseScore() : this.handleDecrementLife();
    this.gameService.setAnswerToQuestion(this.questionNumberCounter - 1, this.isCorrectAnswer());
    this.options.forEach(option => {
      option.submittedCard = this.answerChosen === option.cardText;
      option.isCardDisabled = true;
    });
  }

  private handleDecrementLife(): void {
    this.gameService.decrementLife();
    this.getNumberOfLivesRemaining().pipe(first()).subscribe( lives => {
      if (lives === 0) {
        this.onEndOfGame();
      }
    });
  }

  isCorrectAnswer(): boolean {
    return this.currentQuestion$.correctAnswer === this.answerChosen;
  }

  getChosenAnswer($event: string): void {
    this.answerChosen = $event;
    this.options.forEach(option => option.selectedCard = this.answerChosen === option.cardText);
  }

  onSkip(): void {
    this.getNumberOfSkipsRemaining().pipe(first()).subscribe(skips => {
      if (skips === 1) {
        this.disableSkipButton = true;
      }
      this.gameService.decrementSkip();

      this.questionNumberCounter === NUM_OF_QUESTIONS ? this.onEndOfGame() : this.proceedToNextQuestion();
    });
  }

  onContinueClicked(): void {
    this.initializeOptionCards();
    this.answerChosen = '';
    this.answerSubmitted = false;

    this.questionNumberCounter === NUM_OF_QUESTIONS ? this.onEndOfGame() : this.proceedToNextQuestion();
  }

  private initializeOptionCards(): void {
    this.options.forEach(option => {
      option.isCardDisabled = false;
      option.submittedCard = false;
      option.selectedCard = false;
    });
  }

  private proceedToNextQuestion(): void {
    this.getNumberOfSkipsRemaining().pipe(first()).subscribe(skips => this.disableSkipButton = skips === 0);
    this.questionNumberCounter++;
    this.getCurrentQuestionData();
    this.restartTimer();
  }

  private restartTimer(): void {
    this.stopTimer();
    this.startTimer();
  }

  private stopTimer(): void {
    clearInterval(this.interval);
  }

  private onEndOfGame(): void {
    this.endOfGame = true;
    this.getPoints().pipe(first()).subscribe(points => {
      this.leaderboardService.addRecord(new LeaderboardRecord(this.username, points, new Date().toDateString()));
    });
  }

  getNumberOfSkipsRemaining(): Observable<number> {
    return this.gameService.getNumberOfSkipsRemaining();
  }

  getNumberOfLivesRemaining(): Observable<number> {
    return this.gameService.getNumberOfLivesRemaining();
  }

  getPoints(): Observable<number> {
    return this.gameService.getPoints();
  }
}
