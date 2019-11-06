import { Location } from 'src/app/models/location';

export class MapOptions<T> {

    constructor(selectLabel: string, canCreate: boolean = false) {
        this.selectLabel = selectLabel;
        this.canCreate = canCreate;
    }

    locationEntityMap: {key: Location, value: T}[] = new Array<{key: Location, value: T}>();
    selectLabel = 'Select';
    canCreate = false;
}

