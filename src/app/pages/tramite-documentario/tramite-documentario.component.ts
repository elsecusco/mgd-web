import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItemService } from '../menu-item.service';
import { MenuService } from '../../@core/navigator/menu.service';

@Component({
  selector: 'tramite-documentario',
  template: '<router-outlet></router-outlet>',
})
export class TramiteDocumentario implements OnInit, OnDestroy {
  constructor(private service: MenuItemService, private menu: MenuService) {}

  ngOnInit() {
    setTimeout(() => this.getMenu());
  }
  ngOnDestroy() {}

  getMenu() {
    this.service.getItems(802).subscribe((items) => {
      this.menu.publishMenuChange([items]);
    });
  }
}
