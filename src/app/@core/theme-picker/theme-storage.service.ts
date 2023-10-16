import { Injectable, EventEmitter, Inject } from '@angular/core';
import { WINDOW } from '../../@core/window';

export class SiteTheme {
  name: string = '';
  accent: string = '';
  primary: string = '';
  isDark?: boolean;
  isDefault?: boolean;
}

export const Themes: SiteTheme[] = [
  {
    name: 'default',
    primary: '#01579B',
    accent: '#FF5722',
    isDefault: true,
    isDark: false
  },
  {
    name: 'blue',
    primary: '#283592',
    accent: '#03A8F3',
    isDark: false
  },
  {
    name: 'light',
    primary: '#EEEEEE',
    accent: '#FFAB91',
    isDark: false
  },
  {
    name: 'black',
    primary: '#616161',
    accent: '#78909C',
    isDark: true
  }
];

@Injectable()
export class ThemeStorage {
  static storageKey = 'theme-storage-current';

  constructor(@Inject(WINDOW) private window: Window) {}

  public onThemeUpdate: EventEmitter<SiteTheme> = new EventEmitter<SiteTheme>();

  public storeTheme(theme: SiteTheme) {
    this.window.localStorage[ThemeStorage.storageKey] = JSON.stringify(
      theme
    );
    this.onThemeUpdate.emit(theme);
  }

  public getStoredTheme(): SiteTheme {
    return JSON.parse(
      this.window.localStorage[ThemeStorage.storageKey] || null
    );
  }

  public clearStorage() {
    this.window.localStorage.removeItem(ThemeStorage.storageKey);
  }
}
