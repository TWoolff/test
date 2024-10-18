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