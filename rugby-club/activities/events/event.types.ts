export type EventType = 'match' | 'training' | 'social' | 'fundraiser' | 'other';

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface Event {
	id: string;
	title: string;
	type: EventType;
	startDate: Date;
	endDate?: Date;
	description?: string;
	location?: string;
	status: EventStatus;
}

export type CreateEventInput = Omit<Event, 'id' | 'status'> & {
	status?: EventStatus;
};

export type UpdateEventInput = Partial<CreateEventInput>;
