export class CardInfo {
    paymentMethodId: string;
    token: string;
    last4: string;
    zip: string;
    expirationYear: string;
    expirationMonth: string;
}

export class TransactionOptions {
    amountInCents: number;
    meetingId: number;
}

export class DestinationTransactionOptions extends TransactionOptions {
    userId: number;
}
