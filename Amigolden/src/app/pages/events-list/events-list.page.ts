import { Component, OnInit, EventEmitter } from '@angular/core';
import { ListConfiguration, PagingInfo } from 'src/app/components/list-base/data/list-configuration';
import { Router, NavigationExtras } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SearchSettings } from 'src/app/components/search/data/search-settings';
import { ODataDynamicFilterBuilder, ODataPropertyPath } from 'src/app/models/odata/filter/ts-odata-dynamic-filter';
import { RouteNames } from 'src/app/app-routing.module';
import { Meeting } from 'src/app/models/meetings';
import { Location } from 'src/app/models/location';
import { EventsService } from 'src/app/services/endpoints/events.service';
import { LocationsService } from 'src/app/services/endpoints/locations.service';
import { MapOptions } from 'src/app/models/map/map-options';


@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.page.html',
  styleUrls: ['./events-list.page.scss'],
})
export class EventsListPage implements OnInit {

  locationId = 0;
  locations: Location[] = [];
  mapOptions = new MapOptions<Meeting>('View Event', false, false,
    (lat, lon, dist) => this.eventService.getMeetingWithinRange(lat, lon, dist),
    x => this.resolveLocation(x));

  public config = new ListConfiguration<Meeting>(
    (pagingInfo: PagingInfo) =>
      this.eventService.getDynamicList(this.config.filter, pagingInfo.pageSize, pagingInfo.pageNumber),
    {
      // applyODataFilter: (searchTerm) => this.defaultSearchFilter(searchTerm)
    }
  );

  constructor(private router: Router, protected locationService: LocationsService, protected eventService: EventsService) {
    this.loadLocations();
  }

  ngOnInit() {
  }

  resolveLocation(meeting: Meeting): Location {
    return this.locations.find(l => l.id === meeting.locationId);
  }

  loadLocations() {
    this.locationService.getList().subscribe(t => {
      this.locations = t.items;

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          // TODO: the map should take in a way to load entities instead of the concrete ones
          // That way the map can control the update of the position and within range
          this.eventService.getMeetingWithinRange(lat, lon, 10).subscribe(e => {
            this.mapOptions.locationEntityMap = e.map(m => ({
              location: this.locations.find(l => l.id === m.locationId),
              data: m
            }));
          });
        });
      }
    });
  }

  public displayLocation(meeting: Meeting) {
    if (!this.locations) {
      return;
    }
    const location = this.locations.find(loc => loc.id === meeting.locationId);
    if (!location) {
      return '';
    }
    return `${location.name} on ${meeting.meetTime.toLocaleDateString()}/ at ${meeting.meetTime.toLocaleTimeString()}`;
  }

  // defaultSearchFilter(value: string): string {
  //   const filterBuilder = ODataDynamicFilterBuilder.build(builder =>
  //       builder.or(
  //           builder.contains(new ODataPropertyPath('FirstName'), value),
  //           builder.contains(new ODataPropertyPath('LastName'), value),
  //           builder.contains(new ODataPropertyPath('Email'), value)
  //       )
  //   );
  //   return filterBuilder.getString();
  // }

  navigateToDetail(entity: Meeting) {

    const navigationExtras: NavigationExtras = {
      state: { entity }
    };

    this.router.navigate([RouteNames.eventDetail, entity.id], navigationExtras);
  }
}
