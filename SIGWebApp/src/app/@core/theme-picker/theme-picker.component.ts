import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';

import { ThemeService } from './theme.service';
import { ThemeStorage, SiteTheme, Themes } from './theme-storage.service';

@Component({
  selector: 'theme-picker',
  templateUrl: './theme-picker.component.html',
  styleUrls: ['./theme-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line:use-host-property-decorator
  host: { 'aria-hidden': 'true' }
})
export class ThemePickerComponent {
  currentTheme;
  themes = Themes;

  constructor(
    private _themeStorage: ThemeStorage,
    private _themeService: ThemeService
  ) {
    const currentTheme = this._themeStorage.getStoredTheme();
    this.currentTheme = currentTheme ? currentTheme : Themes[0];
  }
  installTheme(theme: SiteTheme) {
    this.currentTheme = theme;
    this._themeService.enviar(theme);
  }
}
