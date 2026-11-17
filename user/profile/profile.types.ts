/* user details after signup */
export interface UserDetail {
    names: string;
    phoneNumber?: string; /* optional */
    age?: number; /* optional */
    gender?: 'male' | 'female'; /* optional */
}