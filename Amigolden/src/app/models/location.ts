import { IHasId } from './interfaces/interfaces';
export class Location implements IHasId {
    id = 0;
    latitude = 0.0;
    longitude = 0.0;
    name = '';
    formattedAddress = '';
}
