
import { Message } from './message';
import { User } from './user';
import { IHasId } from './interfaces/interfaces';

export class Conversation implements IHasId {
    id: number;
    lastMessage: Message;
    primaryRecipient: User;
}

export class ConversationSubscription implements IHasId {
    id: number;
    userId: number;
    subscribeTime: Date;
    isSubscribed: boolean;
    unsubscribeTime: Date;
}
