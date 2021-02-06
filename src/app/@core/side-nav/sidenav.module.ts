import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItemComponent } from './components/menu-item/menu-item.component';
import { SidenavItemComponent } from './components/sidenav-item/sidenav-item.component';
import { IconSidenavDirective } from './icon-sidenav.directive';
import { SidenavComponent } from './sidenav.component';
import {
  MatButtonModule,
  MatChipsModule,
  MatIconModule,
  MatListModule,
  MatRippleModule,
  MatSidenavModule,
  MatToolbarModule
} from '@angular/material';
import { RouterModule } from '@angular/router';

import { FlexLayoutModule } from '@angular/flex-layout';
import { NgScrollbarModule } from 'ngx-scrollbar';
// import { ScrollbarModule } from '@ngx-starter-kit/scrollbar';

@NgModule({
  imports: [
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatSidenavModule,
    MatRippleModule,
    MatChipsModule,
    RouterModule,

    NgScrollbarModule,
    FlexLayoutModule,
    // ScrollbarModule,
    CommonModule
  ],
  exports: [SidenavComponent, IconSidenavDirective],
  declarations: [
    SidenavItemComponent,
    MenuItemComponent,
    SidenavComponent,
    IconSidenavDirective
  ]
})
export class SidenavModule {}
