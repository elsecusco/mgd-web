import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { NgScrollbarModule } from 'ngx-scrollbar';

// CDK
import { CdkAccordionModule } from '@angular/cdk/accordion';

// --- upgraded import versions ---
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_CHIPS_DEFAULT_OPTIONS } from '@angular/material/chips'
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { OverlayModule } from '@angular/cdk/overlay';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

const MODULES = [
  FlexLayoutModule,
  NgScrollbarModule,
  OverlayModule,
  CdkAccordionModule,
  MatToolbarModule,
  MatCardModule,
  MatButtonModule,
  MatSidenavModule,
  MatListModule,
  MatIconModule,
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
  MatButtonToggleModule,
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
