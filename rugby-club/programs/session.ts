type SessionType = 'weekly' | 'bi_weekly' | 'one_time_clinic' | 'camp';

export interface SessionFrequency {
    type: SessionType;
    weekDays?: ( | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' )[];
    preferredTime?: {
        startTime: string;
        endTime: string;
    }
}