import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CoreModule } from '@core/core.module';

import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@NgModule({
  imports: [
    // angular
    BrowserModule,
    BrowserAnimationsModule,
    AppRouting,

    // pdf
    NgxExtendedPdfViewerModule,

    // core
    CoreModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}

