import { Usuario, Authenticate } from '../usuario';

export class Login {
  static readonly type = '[Auth] Login';
  constructor(public readonly payload: Authenticate) {}
}

export class LoginSuccess {
  static readonly type = '[Auth] Login Success';
  constructor(public readonly payload: Usuario) {}
}

export class LoginFail {
  static readonly type = '[Auth] Login Fail';
  constructor(public payload: any) {}
}

export class Logout {
  static readonly type = '[Auth] Logout';
}

export class Authenticated {
  static readonly type = '[Auth] Authenticated';
  constructor(public payload: Usuario) {}
}
