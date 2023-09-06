import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from '../../../../@core/navigator/menu-item.model';

@Component({
  selector: 'ngx-menu-item',
  templateUrl: './menu-item.component.html',
  //Se modifico para que haga referencia al otro archivo
  //styleUrls: ['./menu-item.component.scss']
  styleUrls: ['./menu-item.component.scss-theme.scss'],
})
export class MenuItemComponent implements OnInit {
  @Input()
  item: Partial<MenuItem> = {};
  // item : MenuItem;
  @Input()
  iconOnly: boolean = true;
  @Input()
  secondaryMenu = false;

  constructor() {}

  ngOnInit() {}

  openLink() {
    this.item['open'] = this.item['open'];
    // this.item.open = this.item.open;
  }
  getHeight() {
    if (this.item['open'] === false) {
      // if (this.item.open === false) {
      return '48px';
    } else {
      if (this.item && this.item.children) {
        const height = this.item.children.length * 56 + 56 + 'px';
        return height;
      } else return;
    }
  }

  chechForChildMenu() {
    return !!(this.item && this.item.children);
  }
}
