import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

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
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'users', loadChildren: './pages/users-list/users-list.module#UsersListPageModule', canActivate: [AuthGuard] },
  { path: 'users/:id', loadChildren: './pages/user-detail/user-detail.module#UserDetailPageModule' },
  { path: 'users/:id/events', loadChildren: './pages/user-events-list/user-events-list.module#UserEventsListPageModule' },
  { path: 'events', loadChildren: './pages/enrollment/enrollment.module#EnrollmentPageModule' },
  { path: 'events/:id', loadChildren: './pages/event-detail/event-detail.module#EventDetailPageModule' },
  { path: 'events/:id/payments', loadChildren: './pages/payment/payment.module#PaymentPageModule' },
  { path: 'messages', loadChildren: './pages/messages-list/messages-list.module#MessagesListPageModule' },
  { path: 'messages/:id', loadChildren: './pages/messages/messages.module#MessagesPageModule' },
  { path: 'conversations', loadChildren: './pages/conversations/conversations.module#ConversationsPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
