import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Event as NavigationEvent } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { filter } from 'rxjs/operators';
import { Identity } from './services/identity/identity.service';
import { RouteNames } from './app-routing.module';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  public appPages: Array<{title: string, icon: string, url: string}> = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Users',
      url: '/users',
      icon: 'Contacts'
    },
    {
      title: 'Events',
      url: '/events',
      icon: 'ice-cream'
    },
    {
      title: 'Messages',
      url: '/messages',
      icon: 'chatbubbles'
    },
    {
      title: 'Logout',
      url: '/login',
      icon: 'log-out'
    }
  ];

  profileMenuItem = {
    title: 'My Profile',
    icon: 'person',
  };

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    public userIdentity: Identity,
  ) {
    this.initializeApp();
    this.handleNavigation();
    this.userIdentity.getCurrentUser();
  }

  navigateToProfile() {
    this.router.navigate([RouteNames.users, this.userIdentity.userId]);
  }

  handleNavigation() {
    this.router.events
            .pipe(
              filter((event: NavigationEvent) => (event instanceof NavigationStart)))
            .subscribe(( event: NavigationStart ) => {

              console.group( 'NavigationStart Event' );
              // Every navigation sequence is given a unique ID. Even "popstate"
              // navigations are really just "roll forward" navigations that get
              // a new, unique ID.
              console.log('navigation id:', event.id);
              console.log('route:', event.url);
              // The "navigationTrigger" will be one of:
              // --
              // - imperative (ie, user clicked a link).
              // - popstate (ie, browser controlled change such as Back button).
              // - hashchange
              // --
              // NOTE: I am not sure what triggers the "hashchange" type.
              console.log('trigger:', event.navigationTrigger);

              // This "restoredState" property is defined when the navigation
              // event is triggered by a "popstate" event (ex, back / forward
              // buttons). It will contain the ID of the earlier navigation event
              // to which the browser is returning.
              // --
              // CAUTION: This ID may not be part of the current page rendering.
              // This value is pulled out of the browser; and, may exist across
              // page refreshes.
              if ( event.restoredState ) {
                this.router.getCurrentNavigation().extras.state = event.restoredState;
                console.warn('restoring navigation id:', event.restoredState.navigationId);
              }
              console.groupEnd();
          });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
