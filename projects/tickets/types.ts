type user = {
    id: string;
    name: string;
    username: string;
    email: string;
    phone_number?: number;
    address?: string;
}

type paymentMethod = "credit_card" | "paypal" | "bank_transfer" | "crypto" | "cash";

type ticket = {
    id: string;
    details: ticketDetails;
    paymentMethod: paymentMethod;
    user: user;
}

type ticketDetails = {
    id: string;
    title: string;
    description: string;
    venue: string;
    date: string;
    time: string;
    price: number;
}

type orderDetails = {
    id: string;
    ticket: ticket;
    quantity: number;
    totalPrice: number;
    timestamp: string;
}

export interface requiredTypes {
    Ticket: ticket;
    User: user;
    Order: orderDetails;
}