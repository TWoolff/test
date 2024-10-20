export type FormData = Record<string, unknown>;

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
  gifUrl?: string;
};

export type TeamReference = {
  [x: string]: string | undefined;
  id: string;
  name: string;
};

export type MatchType = {
  id: string;
  homeTeam: TeamReference;
  awayTeam: TeamReference;
  homeScore: number;
  awayScore: number;
  completed: boolean;
  winner: string | null;
  date: string;
  completedDate?: string;
}

export type MatchData = {
  score: string;
  date: string;
  completed: boolean;
}

export type CleanTeamData = {
  name: string;
  players?: PlayerType[];
  points: number;
  gifUrl?: string;
  [key: string]: string | number | string[] | undefined | TeamType[] | PlayerType[];
};
