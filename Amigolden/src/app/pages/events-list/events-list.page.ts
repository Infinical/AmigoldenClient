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


@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.page.html',
  styleUrls: ['./events-list.page.scss'],
})
export class EventsListPage implements OnInit {

  locationId = 0;
  locations: Location[];

  public config = new ListConfiguration<Meeting>(
    (pagingInfo: PagingInfo) =>
      this.eventService.getDynamicList(this.config.filter, pagingInfo.pageSize, pagingInfo.pageNumber),
    {
      onItemClick: (entity) => this.navigateToDetail(entity),
      // applyODataFilter: (searchTerm) => this.defaultSearchFilter(searchTerm)
    }
  );

  constructor(private router: Router, protected locationService: LocationsService, protected eventService: EventsService) {
    this.loadLocations();
  }

  ngOnInit() {
  }

  loadLocations() {
    this.locationService.getList().subscribe(t => {
      this.locations = t.items;
    });
  }

  public displayLocation(meeting: Meeting) {
    const location = this.locations.find(loc => loc.id === meeting.locationId);
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
      state: {
        entity,
        entityId: entity.id
      }
    };

    this.router.navigate([RouteNames.eventDetail, entity.id], navigationExtras);
  }
}
