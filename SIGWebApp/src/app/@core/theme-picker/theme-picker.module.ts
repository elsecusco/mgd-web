import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemePickerComponent } from './theme-picker.component';
import { ThemeStorage } from './theme-storage.service';
import { ThemeService } from './theme.service';
import {
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatGridListModule,
  MatTooltipModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,

    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatGridListModule,
    MatTooltipModule
  ],
  exports: [ThemePickerComponent],
  declarations: [ThemePickerComponent]
})
export class ThemePickerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ThemePickerModule,
      providers: [ThemeStorage, ThemeService]
    };
  }
}
