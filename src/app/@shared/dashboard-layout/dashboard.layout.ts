import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { RouterState } from '@ngxs/router-plugin';

import { MediaChange, MediaObserver } from '@angular/flex-layout';

import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
// import { untilDestroy } from '../../@core/untilDestroy';

@Component({
  selector: 'ngx-dashboard-layout',
  templateUrl: './dashboard.layout.html',
  styleUrls: ['./dashboard.layout.scss'],
  // animations: [routeAnimation],
  // animations: [hierarchicalRouteAnimation],
  // encapsulation: ViewEncapsulation.None
})
export class DashboardLayout implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav: any; //--- any

  sidenavOpen = true;
  sidenavMode = 'side';
  isMobile = false;
  crumbs$: any; //--add :any
  // depth$;
  private subscription!: Subscription
  private mediaSubscription!: Subscription

  constructor(
    private router: Router,
    private store: Store,
    private mediaObserver: MediaObserver,
  ) {}

  ngOnInit() {
    this.crumbs$ = this.store.select<any>(RouterState.state).pipe(
      map((state) =>
        Array.from(state.breadcrumbs, ([key, value]) => ({
          name: key,
          link: '/' + value,
        }))
      )
    );

    // this.depth$ = this.store
    //   .select<any>(RouterState.state)
    //   .pipe(map(state => state.data.depth));

    this.mediaSubscription = this.mediaObserver
      .asObservable()
      .pipe()
      .subscribe((change: MediaChange[]) => {
        const isMobile =
          change[0].mqAlias === 'xs' || change[0].mqAlias === 'sm';

        this.isMobile = isMobile;
        this.sidenavMode = isMobile ? 'over' : 'side';
        this.sidenavOpen = !isMobile;
      });

    this.subscription = this.router.events.pipe().subscribe((event) => {
      if (event instanceof NavigationEnd && this.isMobile) {
        this.sidenav.close();
      }
    });

    // setTimeout(() => {
    //   this.window.dispatchEvent(new Event('resize'));
    // }, 2000);

    // Disable WebSocket in mock mode
  }

  ngOnDestroy() {
    this.mediaSubscription.unsubscribe();
    this.subscription.unsubscribe();
  }
  getRouteDepth(outlet: any) {
    return outlet.activatedRouteData['depth'] || 1;
    // return outlet.isActivated ? outlet.activatedRoute : ''
  }
}
