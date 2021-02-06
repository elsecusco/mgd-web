import { NgModule } from '@angular/core';
// other modules
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';

export function tokenGetter() {
  return localStorage.getItem('token');
}
export const whitelistedDomains = [new RegExp('[sS]*')] as RegExp[];

export function jwtOptionsFactory() {
  return { tokenGetter, whitelistedDomains };
}

@NgModule({
  imports: [
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory
      }
    })
  ]
})
export class JWTModule {}
