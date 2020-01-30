import { IHasId } from './interfaces/interfaces';
import { environment } from 'src/environments/environment';

export enum EventType {
   Vote,
   AlaCarte
}

export class Meeting implements IHasId {
    id = 0;
    locationId = 0;
    meetTime = new Date();
    isFinalized = false;
    imageId: number = null;
    description = '';
    name = '';
    ownerId = 0;
    eventType = EventType.AlaCarte;
    eventCostInCents = 0;
}
