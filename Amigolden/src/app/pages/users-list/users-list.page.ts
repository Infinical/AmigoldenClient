import { Component, OnInit, EventEmitter } from '@angular/core';
import { ListConfiguration, PagingInfo } from 'src/app/components/list-base/data/list-configuration';
import { User } from 'src/app/models/user';
import { Router, NavigationExtras } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UsersEndpointService } from 'src/app/services/endpoints/users-endpoint.service';
import { SearchSettings } from 'src/app/components/search/data/search-settings';
import { ODataDynamicFilterBuilder, ODataPropertyPath } from 'src/app/models/odata/filter/ts-odata-dynamic-filter';
import { RouteNames } from 'src/app/app-routing.module';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.page.html',
  styleUrls: ['./users-list.page.scss'],
})
export class UsersListPage implements OnInit {

  // TODO: we should provide events on user added to set the profile picture
  public config = new ListConfiguration<User>(
    (pagingInfo: PagingInfo) =>
      this.userService.getDynamicList(this.config.filter, pagingInfo.pageSize,
      pagingInfo.pageNumber),
    {
      applyODataFilter: (searchTerm) => this.defaultSearchFilter(searchTerm)
    }
  );

  constructor(private router: Router, protected userService: UsersEndpointService) { }

  ngOnInit() {
  }

  defaultSearchFilter(value: string): string {
    const filterBuilder = ODataDynamicFilterBuilder.build(builder =>
        builder.or(
            builder.contains(new ODataPropertyPath('FirstName'), value),
            builder.contains(new ODataPropertyPath('LastName'), value),
            builder.contains(new ODataPropertyPath('Email'), value)
        )
    );
    return filterBuilder.getString();
  }

  navigateToDetail(entity: User) {

    const navigationExtras: NavigationExtras = {
      state: { entity }
    };

    this.router.navigate([RouteNames.users, entity.id], navigationExtras);
  }
}
