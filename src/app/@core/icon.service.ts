import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Injectable()
export class IconService {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {}
  init() {
    this.iconRegistry
      .addSvgIcon('excel-file',this.sanitizer.bypassSecurityTrustResourceUrl('assets/svg/excel-file.svg'))
      .addSvgIcon('txt-file',this.sanitizer.bypassSecurityTrustResourceUrl('assets/svg/txt-file.svg'))
      .addSvgIcon('zip-file',this.sanitizer.bypassSecurityTrustResourceUrl('assets/svg/zip-file.svg'))
      .addSvgIcon('pdf-file',this.sanitizer.bypassSecurityTrustResourceUrl('assets/svg/pdf-file.svg'))
      .addSvgIcon('jpg-file',this.sanitizer.bypassSecurityTrustResourceUrl('assets/svg/jpg-file.svg'))
      .addSvgIcon('management',this.sanitizer.bypassSecurityTrustResourceUrl('assets/svg/management.svg'));
  }
}
