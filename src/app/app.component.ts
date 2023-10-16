import { Component, OnInit } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { IconService } from './@core/icon.service';
import { ThemeService } from './@core/theme-picker/theme.service';
import {
  ThemeStorage,
  SiteTheme,
  Themes,
} from './@core/theme-picker/theme-storage.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  constructor(
    private overlay: OverlayContainer,
    private themeService: ThemeService,
    private themeStorage: ThemeStorage,
    private icons: IconService
  ) {
    this.icons.init();
  }
  ngOnInit(): void {
    this.installDefaultTheme();
    this.themeService.recibir().subscribe((theme) => this.setTheme(theme));
  }

  private installDefaultTheme() {
    const currentTheme = this.themeStorage.getStoredTheme();
    const newTheme = currentTheme ? currentTheme : Themes[0];
    this.setTheme(newTheme);
  }
  private setTheme(theme: SiteTheme) {


    const body = document.getElementsByTagName('body')[0];
    const classList = body.classList;
    const toRemove = Array.from(classList).filter((item: string) =>
      item.includes('-theme')
    );

    classList.remove(...toRemove);
    classList.add(`${theme.name}-theme`);
    this.overlay.getContainerElement().classList.remove(...toRemove);
    this.overlay.getContainerElement().classList.add(`${theme.name}-theme`);

    this.themeStorage.storeTheme(theme);
  }
}
