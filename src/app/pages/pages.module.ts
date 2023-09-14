export const defaultMenu: MenuItem[] = [
  {
    name: 'Home',
    icon: 'home',
    link: '/home',
  },
  {
    name: 'Dashboard',
    icon: 'dashboard',
    link: '/dashboard',
  },
  // {
  //   name: 'Custom components',
  //   type: SidenavItemType.Separator,
  // },
  {
    name: 'Grid',
    icon: 'insert_chart',
    disabled: false,
    children: [
      {
        name: 'CRUD Table',
        icon: 'web_aaset',
        link: '/dashboard/grid/crud-table',
      },
      {
        name: 'Grid List',
        icon: 'grid_on',
        link: '/dashboard/grid/grid-list',
      },
    ],
  },
  {
    name: 'Experiments',
    icon: 'pie_chart_outlined',
    disabled: false,
    children: [
      {
        name: 'Animations',
        icon: 'view_list',
        link: '/dashboard/experiments/animations',
      },
      {
        name: 'Upload',
        icon: 'directions',
        link: '/dashboard/experiments/file-upload',
      },
      {
        name: 'Context Menu',
        icon: 'web_aaset',
        link: '/dashboard/experiments/context-menu',
      },
      {
        name: 'Virtual Scroll',
        icon: 'reorder',
        link: '/dashboard/experiments/virtual-scroll',
      },
      {
        name: 'Sticky Table',
        icon: 'view_list',
        link: '/dashboard/experiments/table',
      },
      {
        name: 'Knob',
        icon: 'directions',
        link: '/dashboard/experiments/knob',
      },
      {
        name: 'Layout',
        icon: 'apps',
        link: '/dashboard/experiments/layout',
      },
      // {
      //   name: 'Microinteractions',
      //   icon: 'casino',
      //   disabled: false,
      //   children: [
      //     {
      //       name: 'Clap',
      //       icon: 'pan_tool',
      //       link: '/dashboard/experiments/clap',
      //     },
      //     {
      //       name: 'Led',
      //       icon: 'highlight',
      //       link: '/dashboard/experiments/led',
      //     },
      //     {
      //       name: 'Image Comp',
      //       icon: 'tonality',
      //       link: '/dashboard/experiments/image-comp',
      //     },
      //   ],
      // },
    ],
  },
  {
    name: 'Micro-Interactions',
    icon: 'casino',
    disabled: false,
    children: [
      {
        name: 'Clap',
        icon: 'pan_tool',
        link: '/dashboard/experiments/clap',
      },
      {
        name: 'Led',
        icon: 'highlight',
        link: '/dashboard/experiments/led',
      },
      {
        name: 'Image Comp',
        icon: 'tonality',
        link: '/dashboard/experiments/image-comp',
      },
    ],
  },
  {
    name: 'Multi-Level Menu',
    icon: 'menu',
    disabled: false,
    children: [
      {
        name: 'Level 1',
        link: '/level1',
        children: [
          {
            name: 'Level 2',
            link: '/level1/level2',
            children: [
              {
                name: 'Level 3',
                link: '/level1/level2/level3',
                children: [
                  {
                    name: 'Level 4',
                    link: '/level1/level2/level3/level4',
                    children: [
                      {
                        name: 'Level 5',
                        link: '/level1/level2/level3/level4/level5',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PagesRoutingModule } from './pages-routing.module';

import { Pages } from './pages';
import { MenuItem } from '../@core/navigator/menu-item.model';
import { InicioPage, InicioComponent } from './inicio';
import { MenuItemService } from './menu-item.service';
import { SharedModule } from '../@shared/shared.module';

const COMPONENTS = [Pages, InicioPage, InicioComponent];

const MODULES = [
  CommonModule,
  FormsModule,
  PagesRoutingModule,
  SharedModule,
  // NavigatorModule.forRoot([])
];
const PROVIDERS = [MenuItemService];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [...MODULES],
  providers: [...PROVIDERS]
})
export class PagesModule {}
