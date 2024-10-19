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
  players: string[];
  points: number;
};

export type MatchData = {
  id?: string;
  homeTeam: string;
  awayTeam: string;
};

export type MatchType = {
  id: string;
  homeTeam: TeamType;
  awayTeam: TeamType;
  homeScore?: number;
  awayScore?: number;
  completed: boolean;
  winner?: string; // Team ID
};

export type MatchWithScore = MatchType & { 
  homeTeam: TeamType; 
  awayTeam: TeamType; 
  score?: { home: number; away: number } 
  winner: TeamType;
};