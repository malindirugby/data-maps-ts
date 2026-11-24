export type MatchStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled';

export type MatchResult = 'win' | 'loss' | 'draw';

export interface MatchScore {
	home: number;
	away: number;
}

export interface Match {
	id: string;
	date: Date;
	opponent: string;
	venue?: string;
	isHome: boolean;
	competition?: string;
	status: MatchStatus;
	score?: MatchScore;
	result?: MatchResult;
}
