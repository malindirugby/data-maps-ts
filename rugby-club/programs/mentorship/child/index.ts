export interface ChildMentorship {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string; // ISO 8601 YYYY-MM-DD
    gender: 'male' | 'female' | 'other';
    contactInfo: {
        email: string;
        phone: string;
    };
}


/* Example child */
const exampleChildMentorship: ChildMentorship = {
    id: 'childmentorship1',
    firstName: 'young',
    lastName: 'Doe',
    dateOfBirth: `2010-02-14`,
    gender: 'male',
    contactInfo: {
        email: `youngdoe@domain.com`,
        phone: `+254 712 345 678`
    }
}