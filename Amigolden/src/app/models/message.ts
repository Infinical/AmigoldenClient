import { IHasId, IHasCreated } from './interfaces/interfaces';

export class Message implements IHasId, IHasCreated {
    id = 0;
    conversationId = 0;
    senderUserId = 0;
    created = new Date();
    messageText: string;
}
