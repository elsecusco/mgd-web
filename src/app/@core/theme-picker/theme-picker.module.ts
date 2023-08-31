import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemePickerComponent } from './theme-picker.component';
import { ThemeStorage } from './theme-storage.service';
import { ThemeService } from './theme.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';

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
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: ThemePickerModule,
      providers: [ThemeStorage, ThemeService]
    };
  }
}
