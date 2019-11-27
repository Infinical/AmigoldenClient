import { Location } from 'src/app/models/location';
import { Observable } from 'rxjs';

export class MapOptions<T> {

    locationEntityMap: {location: Location, data: T}[] = new Array<{location: Location, data: T}>();
    selectLabel = 'Select';
    canCreate = false;
    startInCreateMode = false;

    constructor(selectLabel: string, canCreate = false, startInCreateMode = false,
                getData: (lat, lon, dist) => Observable<T[]>, locationResolver: (entity: T) => Location) {
        this.selectLabel = selectLabel;
        this.canCreate = canCreate;
        this.startInCreateMode = startInCreateMode;

        this.getData = getData;
        this.locationResolver = locationResolver;
    }

    locationResolver: (entity: T) => Location;
    getData: (lat, lon, dist) => Observable<T[]>;
}
