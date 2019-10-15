import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export class RouteParams {
  public static readonly id = ':id';
}

export class RouteNames {

  public static readonly login = 'login';
  public static readonly messages = 'messages';
  public static readonly events = 'events';
  public static readonly users = 'users';

  public static readonly messageDetail = RouteNames.messages + '/';
  public static readonly eventDetail = RouteNames.events + '/';
  public static readonly userDetail = RouteNames.users + '/';

  public static readonly messageDetailFormat = RouteNames.messageDetail + RouteParams.id;
  public static readonly eventDetailFormat = RouteNames.eventDetail + RouteParams.id;
  public static readonly userDetailFormat = RouteNames.userDetail + RouteParams.id;

  public static readonly userEvents = RouteNames.userDetailFormat + '/' + RouteNames.events;
}

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
  },
  { path: RouteNames.login, loadChildren: './pages/login/login.module#LoginPageModule' },
  {
    path: RouteNames.users,
    loadChildren: './pages/users-list/users-list.module#UsersListPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: RouteNames.userDetailFormat,
    loadChildren: './pages/user-detail/user-detail.module#UserDetailPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: RouteNames.userEvents,
    loadChildren: './pages/user-events-list/user-events-list.module#UserEventsListPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: RouteNames.events,
    loadChildren: './pages/events-list/events-list.module#EventsListPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: RouteNames.eventDetailFormat,
    loadChildren: './pages/event-detail/event-detail.module#EventDetailPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: RouteNames.messages,
    loadChildren: './pages/messages-list/messages-list.module#MessagesListPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: RouteNames.messageDetailFormat,
    loadChildren: './pages/messages/messages.module#MessagesPageModule',
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
