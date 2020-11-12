import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Question} from './question';
import {Store} from '@ngrx/store';
import {CORRECT_HEADER, INCORRECT_HEADER, QUESTION_HEADER} from '../shared/global';
import {GameData} from '../game/game-data';
import {AppState} from '../app.state';
import {DecrementSkip, LoadInitialData} from '../game/actions/game-data.actions';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private readonly url = 'https://opentdb.com/api.php?amount=10&type=multiple';

  constructor(private http: HttpClient,
              private store: Store<AppState>) {
  }

  public getQuestions(): Observable<Question[]> {
    return this.http.get<any>(this.url).pipe(
      map(response => {
        return response.results.map(questionData => this.createQuestion(questionData));
      }),
      catchError(null)
    );
  }

  private createQuestion(questionData: any): Question {
    return new Question(questionData[QUESTION_HEADER], questionData[CORRECT_HEADER], questionData[INCORRECT_HEADER]);
  }

  public getGameData(): Observable<GameData> {
    return this.store.select('gameData');
  }

  public setStartGameData(game: GameData): void {
    this.store.dispatch(new LoadInitialData(game));
  }

  public decrementSkip(): void {
    this.store.dispatch(new DecrementSkip());
  }
}
