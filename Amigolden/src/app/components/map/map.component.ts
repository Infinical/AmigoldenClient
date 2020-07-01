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
} from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { ModalController, IonInput, Platform } from '@ionic/angular';
import { Location } from 'src/app/models/location';
import { MapOptions } from 'src/app/models/map/map-options';
import * as _ from 'underscore';

import { IonSlides } from '@ionic/angular';


declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
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
  address = '';
  town = '';
  state = '';
  isCreating = false;
  i = 0;
  locationEntitiesMap = new Array<{ location: Location; data: Array<any> }>();
  private geoCoder;

  icon = {
    url: './assets/images/maps-and-flags.svg',
    scaledSize: {
      width: 40,
      height: 60,
    },
  };

  @ViewChild('search', { static: false })
  public search: IonInput;

  @ViewChild(IonSlides, { static: false }) slides: IonSlides;

  slideOptions = {
    on: {
      beforeInit() {
        const swiper = this;
        swiper.classNames.push(`${swiper.params.containerModifierClass}flip`);
        swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
        const overwriteParams = {
          slidesPerView: 1,
          slidesPerColumn: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          spaceBetween: 0,
          virtualTranslate: true,
        };
        swiper.params = Object.assign(swiper.params, overwriteParams);
        swiper.originalParams = Object.assign(
          swiper.originalParams,
          overwriteParams
        );
      },
      setTranslate() {
        const swiper = this;
        const { $, slides, rtlTranslate: rtl } = swiper;
        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = slides.eq(i);
          let progress = $slideEl[0].progress;
          if (swiper.params.flipEffect.limitRotation) {
            progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
          }
          const offset$$1 = $slideEl[0].swiperSlideOffset;
          const rotate = -180 * progress;
          let rotateY = rotate;
          let rotateX = 0;
          let tx = -offset$$1;
          let ty = 0;
          if (!swiper.isHorizontal()) {
            ty = tx;
            tx = 0;
            rotateX = -rotateY;
            rotateY = 0;
          } else if (rtl) {
            rotateY = -rotateY;
          }

          $slideEl[0].style.zIndex =
            -Math.abs(Math.round(progress)) + slides.length;

          if (swiper.params.flipEffect.slideShadows) {
            // Set shadows
            let shadowBefore = swiper.isHorizontal()
              ? $slideEl.find('.swiper-slide-shadow-left')
              : $slideEl.find('.swiper-slide-shadow-top');
            let shadowAfter = swiper.isHorizontal()
              ? $slideEl.find('.swiper-slide-shadow-right')
              : $slideEl.find('.swiper-slide-shadow-bottom');
            if (shadowBefore.length === 0) {
              shadowBefore = swiper.$(
                `<div class="swiper-slide-shadow-${
                swiper.isHorizontal() ? 'left' : 'top'
                }"></div>`
              );
              $slideEl.append(shadowBefore);
            }
            if (shadowAfter.length === 0) {
              shadowAfter = swiper.$(
                `<div class="swiper-slide-shadow-${
                swiper.isHorizontal() ? 'right' : 'bottom'
                }"></div>`
              );
              $slideEl.append(shadowAfter);
            }
            if (shadowBefore.length) {
              shadowBefore[0].style.opacity = Math.max(-progress, 0);
            }
            if (shadowAfter.length) {
              shadowAfter[0].style.opacity = Math.max(progress, 0);
            }
          }
          $slideEl.transform(
            `translate3d(${tx}px, ${ty}px, 0px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
          );
        }
      },
      setTransition(duration) {
        const swiper = this;
        const { slides, activeIndex, $wrapperEl } = swiper;
        slides
          .transition(duration)
          .find(
            '.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left'
          )
          .transition(duration);
        if (swiper.params.virtualTranslate && duration !== 0) {
          let eventTriggered = false;
          // eslint-disable-next-line
          slides.eq(activeIndex).transitionEnd(function onTransitionEnd() {
            if (eventTriggered) { return; }
            if (!swiper || swiper.destroyed) { return; }

            eventTriggered = true;
            swiper.animating = false;
            const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
            for (let i = 0; i < triggerEvents.length; i += 1) {
              $wrapperEl.trigger(triggerEvents[i]);
            }
          });
        }
      },
    },
  };




  height = 0;
  slideChanged() {
    this.slides.getActiveIndex().then((index) => {
      this.i = index;
    });
  }

  // slider functions

  slidePrev(slides) {
    slides.slidePrev();
  }
  slideNext(slides) {
    slides.slideNext();
  }


  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    protected modalController: ModalController,
    public platform: Platform
  ) {
    this.height = platform.height() - 200;
  }

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

        const groups = group(entitiesMap, 'location');
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

  clickedMarker(locationPair: { location: Location; data: any[] }) { }

  create() {
    this.isCreating = true;
  }

  save() {
    this.locationSelected.emit({ location: this.selectedLocation });
  }

  cancel() { }

  ngOnInit() {
    // load Places Autocomplete
    this.mapsAPILoader.load().then(async () => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();
      const native = await this.search.getInputElement();
      const autocomplete = new google.maps.places.Autocomplete(native, {
        types: ['address'],
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place = autocomplete.getPlace();
          this.address = '';
          this.town = '';
          this.state = '';
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
          // this.address = place.formatted_address;
          this.address = place.address_components[0].short_name;
          this.town = place.address_components[1].short_name;
          this.state = place.address_components[2].short_name;
          // console.log(place);
          this.zoom = 12;
        });
      });
    });
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 10;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }

  markerDragEnd($event: MouseEvent) {
    // console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude, longitude) {
    this.address = '';
    this.town = '';
    this.state = '';
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        // console.log(results);
        // console.log(status);
        if (status === 'OK') {
          if (results[0]) {
            this.zoom = 12;

            // this.address = results[0].formatted_address;
            this.address = results[0].address_components[0].short_name;
            this.town = results[0].address_components[1].short_name;
            this.state = results[0].address_components[2].short_name;
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      }
    );
  }
}
