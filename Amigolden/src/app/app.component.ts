import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Event as NavigationEvent } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { filter } from 'rxjs/operators';
import { Identity } from './services/identity/identity.service';
import { identity } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  public appPages: Array<{title: string, icon: string, url(): string}> = [
    {
      title: 'Home',
      url() { return '/home'; },
      icon: 'home'
    },
    {
      title: 'Users',
      url() { return '/users'; },
      icon: 'Contacts'
    },
    {
      title: 'Events',
      url() { return '/events'; },
      icon: 'ice-cream'
    },
    {
      title: 'Messages',
      url() { return '/messages'; },
      icon: 'chatbubbles'
    },
    {
      title: 'Logout',
      url() { return '/login'; },
      icon: 'log-out'
    },
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private userIdentity: Identity,
  ) {
    this.initializeApp();
    this.handleNavigation();
    this.appPages.push({
      title: 'My Profile',
      url() { return '/users/' + userIdentity.userId; },
      icon: 'person'
    });
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
