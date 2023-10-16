import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ToolbarComponent } from './toolbar.component';

import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { SidenavToggleComponent } from './components/sidenav-toggle/sidenav-toggle.component';
import { FullscreenToggleComponent } from './components/fullscreen-toggle/fullscreen-toggle.component';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

import { ClickOutsideDirective } from './components/click-outside.directive';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ThemePickerModule } from '../../@core/theme-picker/theme-picker.module';

const MATERIAL_MODULES = [
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatMenuModule,
  MatListModule,
  MatDividerModule,
  MatToolbarModule,
  MatButtonModule,
  FlexLayoutModule
];

@NgModule({
  imports: [CommonModule, RouterModule, ...MATERIAL_MODULES, ThemePickerModule],
  exports: [ToolbarComponent],
  declarations: [
    ToolbarComponent,
    SearchBarComponent,
    UserMenuComponent,
    FullscreenToggleComponent,
    SidenavToggleComponent,
    ClickOutsideDirective
  ]
})
export class ToolbarModule {}
