import { IHasId } from './interfaces/interfaces';

export class User implements IHasId {

    constructor(id: number) {
        this.id = id;
    }

    id = 0;
    firstName = '';
    lastName = '';
    email = '';
    birthday = new Date();
    uniqueIdentifier = '';
    profilePictureId?: number = null;
    profilePictureUrl?: string = null;
}
