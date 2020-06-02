import { Component, OnInit } from '@angular/core';

import { Observable, of } from 'rxjs';
import { MenuItemService } from '../menu-item.service';
import { MenuService } from '@core/navigator/menu.service';

@Component({
  selector: 'inicio-page',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss']
})
export class InicioPage implements OnInit {
  items: any;
  pending$: Observable<boolean>;

  constructor(private service: MenuItemService, private menu: MenuService) {}

  ngOnInit() {
    setTimeout(() => this.getMenu());
  }
  ngOnDestroy() {}

  getMenu() {
    this.service.getItems(701).subscribe(items => {
      this.items = items.children;
      this.menu.publishMenuChange([items]);
    });
  }
}
