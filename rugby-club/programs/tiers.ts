export interface baseTier {
    id: string;
    name: string;
    description: string;
    benefits: Benefits[];
}

/* subscription benefits */
interface Benefits {
    id: string;
    name: string;
    description: string;
    url: string;
}

/* Free program tier */
interface FreeTier extends baseTier {
    isFree: true;
}

interface PaidTier extends baseTier {
    isFree: false;
    PaymentDetails: PaymentDetails;
}

interface PaymentDetails {
    paymentProvider: 'stripe' | 'paypal' | 'other';
    price: number;
}

export type subscriptionTier = FreeTier | PaidTier;