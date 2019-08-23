import { Component, OnInit, EventEmitter } from '@angular/core';
import { ListConfiguration, PagingInfo } from 'src/app/models/list-configuration';
import { User } from 'src/app/models/user';
import { Router, NavigationExtras } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UsersEndpointService } from 'src/app/services/endpoints/users-endpoint.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.page.html',
  styleUrls: ['./users-list.page.scss'],
})
export class UsersListPage implements OnInit {

  filter = '';
  public config: ListConfiguration<User> = {
    canDelete: false,
    onItemClick: (entity) => this.navigateToDetail(entity),
    getList: (pagingInfo: PagingInfo) =>
       this.userService.getDynamicList(this.filter, pagingInfo.pageSize,
                    pagingInfo.pageNumber),
    defaultPagingInfo: new PagingInfo(50),
    // TODO: refresh should wait before refreshes to avoid duplicates
    refresh: new EventEmitter<any>(),
    isSliding: false,
    isReverse: false,
    isSinglePage: false,
  };

  constructor(private router: Router, protected userService: UsersEndpointService) { }

  ngOnInit() {
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
