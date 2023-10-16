import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollToTopComponent } from './scroll-to-top.component';
// --- upgraded version
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';

@NgModule({
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    CommonModule,
    NgxPageScrollCoreModule
  ],
  exports: [ScrollToTopComponent],
  declarations: [ScrollToTopComponent]
})
export class ScrollToTopModule {}
