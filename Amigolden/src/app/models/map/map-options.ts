import { Location } from 'src/app/models/location';

export class MapOptions<T> {

    constructor(selectLabel: string, canCreate = false, startInCreateMode = false) {
        this.selectLabel = selectLabel;
        this.canCreate = canCreate;
        this.startInCreateMode = startInCreateMode;
    }

    locationEntityMap: {location: Location, data: T}[] = new Array<{location: Location, data: T}>();
    selectLabel = 'Select';
    canCreate = false;
    startInCreateMode = false;
}

