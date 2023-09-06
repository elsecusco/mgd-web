import {
  AfterViewInit,
  EventEmitter,
  Component,
  Inject,
  OnDestroy,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { scrollFabAnimation } from '../../@core/animations/scroll-fab.animation';
import { PageScrollInstance, PageScrollService } from 'ngx-page-scroll-core';
import {
  distinctUntilChanged,
  map,
  share,
  tap,
  throttleTime,
} from 'rxjs/operators';
import { BehaviorSubject, Subscription, fromEvent } from 'rxjs';
import { WINDOW } from '../../@core/window';
// import { untilDestroy } from '../../@core/untilDestroy';

enum ShowStatus {
  show = 'show',
  hide = 'hide',
}

@Component({
  selector: 'scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.scss'],
  animations: [scrollFabAnimation],
})
export class ScrollToTopComponent implements AfterViewInit, OnDestroy {
  private _stateSubject = new BehaviorSubject<string>(ShowStatus.hide);
  state$ = this._stateSubject.asObservable();

  pageScrollInstance!: PageScrollInstance;

  constructor(
    private pageScrollService: PageScrollService,
    private subscription: Subscription,
    @Inject(DOCUMENT) private document: any,
    @Inject(WINDOW) private window: Window
  ) {}

  ngAfterViewInit() {
    // this.pageScrollInstance = PageScrollInstance.simpleInstance(
    //   this.document,
    //   '#top'
    // );
    this.goToTOP();
    const scroll$ = fromEvent(this.window, 'scroll').pipe(
      throttleTime(10),
      map(() => this.window.scrollY),
      map((y) => {
        if (y > 100) {
          return ShowStatus.show;
        } else {
          return ShowStatus.hide;
        }
      }),
      distinctUntilChanged(),
      share(),
      tap((state) => this._stateSubject.next(state)),
      // untilDestroy(this)
    );
    this.subscription = scroll$.subscribe();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public goToTOP(): void {
    // You may use any valid css selector as scroll target (e.g. ids, class selectors, tags, combinations of those, ...)
    // const pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '.theEnd');
    const subscriber = new EventEmitter<boolean>();
    subscriber.subscribe((val) => {
      // Reached last heading
    });
    this.pageScrollService.scroll({
      document: this.document,
      scrollTarget: '#top',
      scrollFinishListener: subscriber,
    });
  }

  scrollToTop() {
    this.goToTOP();
    // //use if PageScrollService not installed.
    // (function smoothscroll() {
    //   const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
    //   if (currentScroll > 0) {
    //     window.requestAnimationFrame(smoothscroll);
    //     window.scrollTo(0, currentScroll - currentScroll / 20);
    //   }
    // })();
  }
}
