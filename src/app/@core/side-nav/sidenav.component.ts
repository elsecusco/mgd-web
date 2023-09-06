import {
  Component,
  OnInit,
  ViewEncapsulation,
  OnDestroy,
  ChangeDetectorRef,
  Inject,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';

import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

// import { untilDestroy } from '../../@core/untilDestroy';
import { WINDOW } from '../../@core/window';
import { MenuService } from '../../@core/navigator/menu.service';
import { MenuItem } from '../../@core/navigator/menu-item.model';

// import { sidenavAnimation } from '@ngx-starter-kit/animations';

@Component({
  selector: 'ngx-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  // animations: [sidenavAnimation]
  encapsulation: ViewEncapsulation.None,
})
export class SidenavComponent implements OnInit, OnDestroy {
  private _destroyed$ = new Subject<void>();

  items: MenuItem[] | undefined;

  constructor(
    private router: Router,
    private menuService: MenuService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef,
    private subscription: Subscription,
    @Inject(WINDOW) private window: Window
  ) {}

  ngOnInit() {
    this.subscription = this.menuService.items$
      .pipe()
      .subscribe((items: MenuItem[] | undefined) => {
        this.items = items;
      });

    // this.router.events.pipe(untilDestroy(this))
    //   .subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     this.menuService.setCurrentlyOpenByRoute(event.url);
    //     // setTimeout(() => {
    //     //   window.dispatchEvent(new Event('resize'));
    //     // }, 400);
    //     this.cd.markForCheck();
    //   }
    // });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleIconSidenav() {
    setTimeout(() => {
      this.window.dispatchEvent(new Event('resize'));
    }, 300);

    this.menuService.isIconSidenav = !this.menuService.isIconSidenav;

    const snackBarConfig: MatSnackBarConfig = <MatSnackBarConfig>{
      duration: 5000,
    };

    if (this.menuService.isIconSidenav) {
      //this.snackBar.open('Tenga un buen día!', '', snackBarConfig);
    }
  }

  isIconSidenav(): boolean {
    return this.menuService.isIconSidenav;
  }
}
