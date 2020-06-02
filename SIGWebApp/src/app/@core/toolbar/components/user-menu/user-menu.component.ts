import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';

import { Store } from '@ngxs/store';
import { Logout } from '@core/auth/state/auth.action';
import { Usuario } from '@core/auth/usuario';
import { StateResetAll } from 'ngxs-reset-plugin';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { PendienteState } from 'app/pages/tramite-documentario/states/pendientes.state';
import { PopupPendientes } from '@models/tramite/popup-pendientes';

@Component({
  selector: 'ngx-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserMenuComponent implements OnInit {
  isOpen: boolean;
  @Input()
  currentUser: Usuario = null;
  @Emitter(PendienteState.clearCount)
  private clearCount: Emittable<PopupPendientes>;
  
  constructor(private store: Store) {}

  ngOnInit() {
    if (
      this.currentUser.nombreUsuario &&
      this.currentUser.nombreUsuario === 'Sumanth'
    ) {
      // this.currentUser.photoURL = 'assets/img/avatars/user-image.jpg';
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  onClickOutside() {
    this.isOpen = false;
  }

  public logout() {
    this.store.dispatch(
      new StateResetAll()
    );
    this.clearCount.emit();
    this.store.dispatch(new Logout());
  }
}
// import {
//   ChangeDetectionStrategy,
//   Component,
//   Input,
//   OnInit
// } from '@angular/core';

// import { Store } from '@ngxs/store';
// import { Logout } from '@core/auth/state/auth.action';
// import { Usuario } from '@core/auth/usuario';
// import { StateClear, StateResetAll } from 'ngxs-reset-plugin';

// @Component({
//   selector: 'ngx-user-menu',
//   templateUrl: './user-menu.component.html',
//   styleUrls: ['./user-menu.component.scss'],
//   changeDetection: ChangeDetectionStrategy.OnPush
// })
// export class UserMenuComponent implements OnInit {
//   isOpen: boolean;
//   @Input()
//   currentUser: Usuario = null;

//   constructor(private store: Store) {}

//   ngOnInit() {
//     if (
//       this.currentUser.nombreUsuario &&
//       this.currentUser.nombreUsuario === 'Sumanth'
//     ) {
//       // this.currentUser.photoURL = 'assets/img/avatars/user-image.jpg';
//     }
//   }

//   toggleDropdown() {
//     this.isOpen = !this.isOpen;
//   }

//   onClickOutside() {
//     this.isOpen = false;
//   }

//   public logout() {
//     this.store.dispatch(new Logout());
//     this.store.dispatch(new StateResetAll() );
//   }
  
// }
