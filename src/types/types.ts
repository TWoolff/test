import { Dispatch } from 'react';

export type AppContextType = {
	state: State;
	dispatch: Dispatch<Action>;
};

export type Action = { type: 'SET_STATE'; payload: Partial<State> }| { type: string; payload?: any };

export type DataState = {
    data?: InitData;
} | null | undefined | any;

export type ErrorState = string | null;

export type State = {
	error: ErrorState | null;
	data: null | DataState;
	hasLoaded: boolean;
};

export type InitData = {
  title: string;
  slug: string;
};

export type PlayerType = {
  id: string;
  name: string;
  nickname: string;
  profileImage: string;
}

export type TeamType = {
  id: string;
  name: string;
  players: PlayerType[];
  points: number;
};

export type MatchData = {
  id?: string;
  homeTeam: string;
  awayTeam: string;
};

export interface MatchType {
  id: string;
  homeTeam: {
    id: string;
    name: string;
    points: number;
  };
  awayTeam: {
    id: string;
    name: string;
    points: number;
  };
  homeScore: number;
  awayScore: number;
  completed: boolean;
  winner: string | null;
  date: string;
}

export type MatchWithScore = MatchType & { 
  homeTeam: TeamType; 
  awayTeam: TeamType; 
  score?: { home: number; away: number } 
  winner: TeamType;
};