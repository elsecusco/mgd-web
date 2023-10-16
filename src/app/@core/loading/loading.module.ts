import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading.component';
// --- upgraded imports module
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { LoadingService } from './loading.service';

@NgModule({
  imports: [CommonModule, MatProgressSpinnerModule, MatDialogModule],
  declarations: [LoadingComponent],
  // entryComponents: [LoadingComponent] // deprecated
})
export class LoadingModule {
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: LoadingModule,
      providers: [LoadingService]
    };
  }
}
