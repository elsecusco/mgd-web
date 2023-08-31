import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../@core/material.module';
import { ToolbarModule } from '../@core/toolbar/toolbar.module';
import { SidenavModule } from '../@core/side-nav/sidenav.module';
import { ScrollToTopModule } from '../@core/scroll-to-top/scroll-to-top.module';
import { NgxfUploaderModule } from 'ngxf-uploader';

import {
  DashboardLayout,
  TwoPickerComponent,
  PageContainer,
  TableContainer,
  RowContainer
} from '.';

import { LoadingSpinnerComponent } from './loading-spinner.component';
import { ChipsAutocompleteComponent } from './chips-autocomplete/chips-autocomplete.component';
import { UploadComponent } from './upload/upload.component';
import { UploadFile } from './upload-file/upload-file';
import { TableToggleColumn } from './table-toggle-column/table-toggle-column';
import { BreadcrumbsModule } from '../@core/breadcrumbs/breadcrumbs.module';
import { SafePipe } from './safe.pipe';
import { Firma } from './firma/firma';

const MODULES = [MaterialModule];
const COMPONENTS = [
  DashboardLayout,
  PageContainer,
  TableContainer,
  RowContainer,
  TwoPickerComponent,
  LoadingSpinnerComponent,
  ChipsAutocompleteComponent,
  UploadComponent,
  UploadFile,
  TableToggleColumn,
  Firma,
  SafePipe
];

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    ...MODULES,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ToolbarModule,
    SidenavModule,
    ScrollToTopModule,
    NgxfUploaderModule,
    BreadcrumbsModule
  ],
  exports: [...MODULES, ...COMPONENTS]
})
export class SharedModule {}
