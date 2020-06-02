import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CoreModule } from '@core/core.module';

import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';



@NgModule({
  imports: [
    // angular
    BrowserModule,
    PdfViewerModule,
    BrowserAnimationsModule,
    AppRouting,


    // core
    CoreModule
  ],

  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}

