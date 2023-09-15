import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterEvent } from '@angular/router';
import { Store } from '@ngxs/store';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { RouterState } from '@ngxs/router-plugin';
import { PageTitleService } from '../@core/page-title.service';

@Component({
  selector: 'pages',
  template: `
    <ngx-dashboard-layout>
      <router-outlet></router-outlet>
    </ngx-dashboard-layout>
  `,
})
export class Pages {
  constructor(
    private router: Router,
    private pageTitle: PageTitleService,
    private store: Store
  ) {
    this.routerEvents();
  }

  private reventes() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        distinctUntilChanged((prev: any, curr) => prev.url === this.router.url)
      )
      .subscribe((event: NavigationEnd) => {
        const data = this.store.selectSnapshot<any>(RouterState.state);
        this.pageTitle.setTitle(data.breadcrumbs);
      });
  }
  private routerEvents() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        // (previous: any, current: RouterEvent) => previous.url === current.url
        distinctUntilChanged((prev: any, curr: any) => prev.url === this.router.url)
      )
      .subscribe((event: NavigationEnd) => {
        const data = this.store.selectSnapshot<any>(RouterState.state);
        this.pageTitle.setTitle(data.breadcrumbs);
      });
  }
}
