import {
  Component,
  OnInit,
  ViewEncapsulation,
  HostBinding
} from '@angular/core';
import { Input } from '@angular/core';
import { MenuService } from '../../../../@core/navigator/menu.service';
import { MenuItem } from '../../../../@core/navigator/menu-item.model';

@Component({
  selector: 'ngx-sidenav-item',
  templateUrl: './sidenav-item.component.html',
  styleUrls: ['./sidenav-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidenavItemComponent implements OnInit {
  @Input()
  item = {} as MenuItem;
  // item: MenuItem

  @HostBinding('class.open')
  get isOpen() {
    return this.menuService.isOpen(this.item);
  }

  @HostBinding('class.sidenav-item')
  sidenavItemClass = true;

  constructor(private menuService: MenuService) {}

  ngOnInit() {
    // console.log("this.item-->",this.item)
  }

  toggleDropdown(): void {
    console.log('first')
    if (this.item.children && this.item.children.length > 0) {
      this.menuService.toggleItemOpen(this.item);
    }
  }

  // Receives the count of Sub Items and multiplies it with 48 (height of one SidenavItem) to set the height for animation.
  getSubItemsHeight(): string {
    return this.getOpenSubItemsCount(this.item) * 48 + 'px';
  }

  // Counts the amount of Sub Items there is and returns the count.
  private getOpenSubItemsCount(item: MenuItem): number {
    let count = 0;

    if (
      item.children &&
      item.children.length > 0 &&
      this.menuService.isOpen(item)
    ) {
      count += item.children.length;

      item.children.forEach(subItem => {
        count += this.getOpenSubItemsCount(subItem);
      });
    }

    return count;
  }
}
