import { Component, OnInit, EventEmitter } from '@angular/core';
import { ListConfiguration, PagingInfo } from 'src/app/models/list-configuration';
import { User } from 'src/app/models/user';
import { Router, NavigationExtras } from '@angular/router';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.page.html',
  styleUrls: ['./users-list.page.scss'],
})
export class UsersListPage implements OnInit {

  public config: ListConfiguration<User> = {
    canDelete: false,
    onItemClick: (entity) => this.navigateToDetail(entity),
    getList: (pagingInfo: PagingInfo) =>
       this.getUsers(pagingInfo.pageSize,
                    pagingInfo.pageNumber),
    defaultPagingInfo: new PagingInfo(3),
    // TODO: refresh should wait before refreshes to avoid duplicates
    refresh: new EventEmitter<any>(),
    isSliding: false,
    isReverse: false,
    isSinglePage: false,
  };

  constructor(private router: Router) { }

  ngOnInit() {
  }

  getUsers(pageSize: number, pageNumber: number): Observable<User[]> {
      let users: Array<User>;
      users =  [...Array<User>(pageSize)].map((_, i) => new User((pageNumber * pageSize) + i));
      return of(users);
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
