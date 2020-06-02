import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollToTopComponent } from './scroll-to-top.component';
import {
  MatButtonModule,
  MatIconModule,
  MatTooltipModule
} from '@angular/material';
import { NgxPageScrollModule } from 'ngx-page-scroll';

@NgModule({
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    CommonModule,
    NgxPageScrollModule
  ],
  exports: [ScrollToTopComponent],
  declarations: [ScrollToTopComponent]
})
export class ScrollToTopModule {}
