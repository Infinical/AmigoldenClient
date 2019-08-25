import { Component, OnInit, EventEmitter } from '@angular/core';
import { ListConfiguration, PagingInfo } from 'src/app/components/search/data/list-configuration';
import { User } from 'src/app/models/user';
import { Router, NavigationExtras } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UsersEndpointService } from 'src/app/services/endpoints/users-endpoint.service';
import { SearchSettings } from 'src/app/components/search/data/search-settings';
import { ODataDynamicFilterBuilder, ODataPropertyPath } from 'src/app/models/odata/filter/ts-odata-dynamic-filter';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.page.html',
  styleUrls: ['./users-list.page.scss'],
})
export class UsersListPage implements OnInit {

  // public config1 = new ListConfiguration<User>({
  //   getList: (pagingInfo: PagingInfo) =>
  //     this.userService.getDynamicList(this.config.filter, pagingInfo.pageSize,
  //     pagingInfo.pageNumber),
  //   onItemClick: (entity) => this.navigateToDetail(entity)
  // });

  public config: ListConfiguration<User> = {
    canDelete: false,
    onItemClick: (entity) => this.navigateToDetail(entity),
    getList: (pagingInfo: PagingInfo) =>
       this.userService.getDynamicList(this.config.filter, pagingInfo.pageSize,
                    pagingInfo.pageNumber),
    defaultPagingInfo: new PagingInfo(50),
    // TODO: refresh should wait before refreshes to avoid duplicates
    refresh: new EventEmitter<any>(),
    isSliding: false,
    isReverse: false,
    isSinglePage: false,
    _filter: '',
    filter: ''
  };

  searchSettings = new SearchSettings(1000);

  constructor(private router: Router, protected userService: UsersEndpointService) { }

  ngOnInit() {
  }

  defaultSearchFilter(value: string): string {
    const filterBuilder = ODataDynamicFilterBuilder.build(builder =>
        builder.or(
            builder.or(
                builder.contains(new ODataPropertyPath('FirstName'), value),
                builder.contains(new ODataPropertyPath('LastName'), value)
            ),
            builder.contains(new ODataPropertyPath('Email'), value)
        ));
    return filterBuilder.getString();
  }

  navigateToDetail(entity: User) {

    const navigationExtras: NavigationExtras = {
      state: {
        entity,
        entityId: entity.id
      }
    };

    this.router.navigate(['users', entity.id], navigationExtras);
  }
}
