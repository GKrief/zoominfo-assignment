import * as GameDataActions from '../actions/game-data.actions';
import {GameData} from '../../../models/game-data';
import {GameStatus} from '../../../models/game-status';
import {POINTS_EARNED_PER_QUESTION} from '../../../constants/global';
import {ADD_POINTS, DECREMENT_LIFE, DECREMENT_SKIP, SET_ANSWER} from '../actions/game-data.actions';

const initialState: GameData = {
  username: '',
  gameQuestions: [],
  gameStatus: new GameStatus()
};

export function reducer(state: GameData = initialState, action: GameDataActions.Actions): GameData {
  const updatedGameStatus = {...state.gameStatus};

  switch (action.type) {
    case GameDataActions.LOAD_INITIAL_DATA:
      return action.payload;

    case DECREMENT_SKIP:
      updatedGameStatus.skips--;
      return {...state, gameStatus: updatedGameStatus};

    case DECREMENT_LIFE:
      updatedGameStatus.livesRemaining--;
      return {...state, gameStatus: updatedGameStatus};

    case ADD_POINTS:
      updatedGameStatus.points += POINTS_EARNED_PER_QUESTION;
      return {...state, gameStatus: updatedGameStatus};

    case SET_ANSWER:
      const updatedQuestion = state.gameQuestions[action.questionIndex];
      return {
        ...state,
        gameQuestions: {
          ...state.gameQuestions,
          [action.questionIndex]: {...updatedQuestion, isCorrectAnswer: action.correctness}
        }
      };

    default:
      return state;
  }
}
