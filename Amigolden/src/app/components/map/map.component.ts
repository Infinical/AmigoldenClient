import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
} from "@angular/core";
import { MapsAPILoader, MouseEvent } from "@agm/core";
import { ModalController } from "@ionic/angular";
import { Location } from "src/app/models/location";
import { MapOptions } from "src/app/models/map/map-options";
import * as _ from "underscore";
import { FormGroup, FormBuilder } from "@angular/forms";
declare var google: any;

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
})
export class MapComponent implements OnInit {
  @Input() infoWindowTemplate: TemplateRef<any>;
  @Output() locationSelected = new EventEmitter<any>();

  // tslint:disable-next-line:variable-name
  _options: MapOptions<any>;
  get options() {
    return this._options;
  }
  @Input() set options(options: MapOptions<any>) {
    this._options = options;
    this.isCreating = options.startInCreateMode;
    this.resolveMapData();
  }

  selectedLocation: Location;
  withinMiles = 10;
  latitude = 40.7362942;
  longitude = -73.9921495;
  zoom: number;
  address: string;
  isCreating = false;

  locationEntitiesMap = new Array<{ location: Location; data: Array<any> }>();
  private geoCoder;
  searchForm: FormGroup;

  @ViewChild("search", { static: false })
  public searchElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    protected modalController: ModalController,
    private fb: FormBuilder
  ) {}

  resolveMapData() {
    this.options
      .getData(this.latitude, this.longitude, this.withinMiles)
      .subscribe((entities) => {
        const entitiesMap = entities.map((e) => ({
          location: this.options.locationResolver(e),
          data: e,
        }));
        const group = (array, prop) =>
          array.reduce((g, item) => {
            const propVal = item[prop];
            const identifier = propVal.id;
            const entry = g[identifier];
            const data = item.data;

            if (entry) {
              entry.data.push(data);
            } else {
              g[identifier] = { location: propVal, data: [data] };
            }
            return g;
          }, {});
        const groups = group(entitiesMap, "location");
        this.locationEntitiesMap =
          Object.keys(groups).map((key) => groups[key]) ||
          new Array<{ location: Location; data: Array<any> }>();
      });
  }

  closeModal() {
    this.modalController.dismiss();
  }

  selectLocation(location: Location, data: any) {
    this.locationSelected.emit({ location, data });
  }

  clickedMarker(locationPair: { location: Location; data: any[] }) {}

  create() {
    this.isCreating = true;
  }

  save() {
    this.locationSelected.emit({ location: this.selectedLocation });
  }

  cancel() {}

  ngOnInit() {
    // load Places Autocomplete
    this.searchForm = this.fb.group({
      autocomplete_input: [""],
    });
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();
      let inputfield = document
        .getElementById("autocomplete_input")
        .getElementsByTagName("input")[0];
      const autocomplete = new google.maps.places.Autocomplete(
        inputfield,

        {
          types: ["address"],
        }
      );

      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          // get the place result
          const place = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.selectedLocation = new Location();
          this.selectedLocation.latitude = place.geometry.location.lat();
          this.selectedLocation.longitude = place.geometry.location.lng();
          this.selectedLocation.formattedAddress = place.formatted_address;
          // TODO: add a way to save the name

          // set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.address = place.formatted_address;
          this.zoom = 12;
        });
      });
    });
  }

  search() {
    if (this.searchForm.value.autocomplete_input.length > 0) {
      let inputfield = document
        .getElementById("autocomplete_input")
        .getElementsByTagName("input")[0];
      this.mapsAPILoader.load().then(() => {
        this.setCurrentLocation();
        this.geoCoder = new google.maps.Geocoder();

        const autocomplete = new google.maps.places.Autocomplete(
          inputfield,

          {
            types: ["address"],
          }
        );

        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            // get the place result
            const place = autocomplete.getPlace();

            // verify result
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }

            this.selectedLocation = new Location();
            this.selectedLocation.latitude = place.geometry.location.lat();
            this.selectedLocation.longitude = place.geometry.location.lng();
            this.selectedLocation.formattedAddress = place.formatted_address;
            // TODO: add a way to save the name

            // set latitude, longitude and zoom
            this.latitude = place.geometry.location.lat();
            this.longitude = place.geometry.location.lng();
            this.address = place.formatted_address;
            this.zoom = 12;
          });
        });
      });
    }
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 10;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }

  markerDragEnd($event: MouseEvent) {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        // console.log(results);
        // console.log(status);
        if (status === "OK") {
          if (results[0]) {
            this.zoom = 12;
            this.address = results[0].formatted_address;
            console.log("address", this.address);
          } else {
            window.alert("No results found");
          }
        } else {
          window.alert("Geocoder failed due to: " + status);
        }
      }
    );
  }
}
