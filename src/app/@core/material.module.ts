import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { NgScrollbarModule } from 'ngx-scrollbar';

// CDK
import { CdkAccordionModule } from '@angular/cdk/accordion';

import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatSidenavModule,
  MatListModule,
  MatIconModule,
  MatToolbarModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatTooltipModule,
  MatTableModule,
  MatRadioModule,
  MatPaginatorModule,
  MatTabsModule,
  MatSnackBarModule,
  MatExpansionModule,
  MatSelectModule,
  MatSortModule,
  MatMenuModule,
  MatCheckboxModule,
  MatAutocompleteModule,
  MatChipsModule,
  MAT_CHIPS_DEFAULT_OPTIONS,
  MatButtonToggleModule
} from '@angular/material';
import { OverlayModule } from '@angular/cdk/overlay';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

const MODULES = [
  FlexLayoutModule,
  NgScrollbarModule,

  OverlayModule,
  CdkAccordionModule,

  MatCardModule,
  MatButtonModule,
  MatSidenavModule,
  MatListModule,
  MatIconModule,
  MatToolbarModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatButtonModule,
  MatTooltipModule,
  MatTableModule,
  MatSortModule,
  MatRadioModule,
  MatPaginatorModule,
  MatTabsModule,

  MatInputModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatDialogModule,
  MatNativeDateModule,

  MatSnackBarModule,
  MatExpansionModule,
  MatSelectModule,
  MatMenuModule,
  MatCheckboxModule,
  MatAutocompleteModule,
  MatChipsModule,
  MatButtonToggleModule
];

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES],
  providers: [
    {
      provide: MAT_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [ENTER, COMMA]
      }
    }
  ]
})
export class MaterialModule {}
