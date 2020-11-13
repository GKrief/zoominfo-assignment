import {AppState} from '../../app.state';
import {GameData} from '../../../models/game-data';
import {createSelector} from '@ngrx/store';

export const getGameDataState = (state: AppState) => state.gameData;

export const getUsernameState = (state: GameData) => state.username;

export const getQuestionState = (state: GameData, index: number) => state.gameQuestions[index];

export const getSkipsState = (state: GameData) => state.gameStatus.skips;

export const getPointsState = (state: GameData) => state.gameStatus.points;

export const getLivesRemainingState = (state: GameData) => state.gameStatus.livesRemaining;

export const getUsername = createSelector(getGameDataState, getUsernameState);

export const getQuestion = createSelector(getGameDataState, getQuestionState);

export const getSkips = createSelector(getGameDataState, getSkipsState);

export const getPoints = createSelector(getGameDataState, getPointsState);

export const getLivesRemaining = createSelector(getGameDataState, getLivesRemainingState);