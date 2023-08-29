import { Store, Action, Selector, State, StateContext } from '@ngxs/store';

import { Navigate } from '@ngxs/router-plugin';
import {
  Login,
  LoginSuccess,
  Logout,
  LoginFail,
  Authenticated
} from './auth.action';
import { AuthService } from '../auth.service';
import { map, catchError } from 'rxjs/operators';
import { Usuario, AuthResponse } from '../usuario';

export interface AuthStateModel {
  loggedIn: boolean;
  pending: boolean;
  usuario: Usuario | null;
  errorMessage: string | null;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    loggedIn: false,
    pending: false,
    usuario: null,
    errorMessage: null
  }
})
export class AuthState {
  @Selector()
  static loggedIn(state: AuthStateModel) {
    return state.loggedIn;
  }

  @Selector()
  static usuario(state: AuthStateModel) {
    return state.usuario;
  }

  @Selector()
  static errorMessage(state: AuthStateModel) {
    return state.errorMessage;
  }

  @Selector()
  static pending(state: AuthStateModel) {
    return state.pending;
  }

  constructor(private store: Store, private authService: AuthService) {}

  @Action(Login)
  login(
    { patchState, dispatch }: StateContext<AuthStateModel>,
    { payload }: Login
  ) {
    patchState({
      loggedIn: false,
      usuario: null,
      errorMessage: null,
      pending: true
    });
    return this.authService.login(payload).pipe(
      map((credentials: AuthResponse) => {
        const userData = this.authService.isAuthenticated(credentials);
        if (userData.isAuth) {
          const user = this.authService.getUser();
          dispatch(new LoginSuccess(user));
        } else {
          dispatch(new LoginFail(userData.message));
        }
      }),
      catchError(err => dispatch(new LoginFail(err.message)))
    );
  }
  @Action(Authenticated)
  authenticated(
    { patchState }: StateContext<AuthStateModel>,
    { payload }: LoginSuccess
  ) {
    patchState({
      loggedIn: true,
      usuario: payload,
      errorMessage: null,
      pending: false
    });
  }

  @Action(LoginSuccess)
  loginSuccess(
    { patchState }: StateContext<AuthStateModel>,
    { payload }: LoginSuccess
  ) {
    patchState({
      loggedIn: true,
      usuario: payload,
      errorMessage: null,
      pending: false
    });

    this.store.dispatch(new Navigate(['/']));
  }

  @Action(LoginFail)
  logoutFail({ patchState }: StateContext<AuthStateModel>, { payload }: any) {
    patchState({
      loggedIn: false,
      usuario: null,
      errorMessage: payload,
      pending: false
    });
  }

  @Action(Logout)
  logout({ patchState }: StateContext<AuthStateModel>) {
    patchState({
      loggedIn: false,
      usuario: null,
      errorMessage: null,
      pending: false
    });
    localStorage.clear();
    this.store.dispatch(new Navigate(['/login']));
  }
}
