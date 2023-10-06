import { Injector, Injectable } from '@angular/core';
import { State, StateContext, Selector } from '@ngxs/store';
import { Receiver, EmitterAction } from '@ngxs-labs/emitter';
import { tap, catchError } from 'rxjs/operators';

import { TramiteService } from '../tramite-documentario.service';

import {
  BandejaFiltro,
  BuscarBandeja,
} from '../../../@models/tramite/bandeja-filtro';
import { of } from 'rxjs';
import { Bandejas } from '../../../@models/tramite/bandejas';
import { BuzonesUsuario } from '../../../@models/tramite/buzones-usuario';
import { BandejaDocumento } from 'src/app/@models/tramite/bandeja-documento';

export interface BandejaStateModel {
  bandejaFiltro: BandejaFiltro;
  bandejaBuscar: BuscarBandeja;
  listaBuzones: BuzonesUsuario[];
  buzonActual: BuzonesUsuario;
  bandejas: Bandejas;
  bandejaActiva: string;
  loaded: boolean;
  pending: boolean;
  internos: string;
}

type FiltroAction = EmitterAction<BandejaFiltro>;
type BuscarAction = EmitterAction<BuscarBandeja>;
type BuzonUsuarioAction = EmitterAction<BuzonesUsuario>;
type BandejaActivaAction = EmitterAction<string>;
type Context = StateContext<BandejaStateModel>;

const defaultStateBandeja = {
  bandejaFiltro: new BandejaFiltro(),
  bandejaBuscar: new BuscarBandeja(),
  listaBuzones: [],
  buzonActual: new BuzonesUsuario(),
  bandejas: new Bandejas(),
  bandejaActiva: 'e',
  loaded: false,
  pending: false,
  internos: '',
};

@State<BandejaStateModel>({
  name: 'bandeja',
  defaults: defaultStateBandeja,
})
@Injectable()
export class BandejaState {
  private static api: TramiteService;

  constructor(injector: Injector) {
    BandejaState.api = injector.get<TramiteService>(TramiteService);
  }

  @Selector()
  static bandejaFiltro(state: BandejaStateModel) {
    return state.bandejaFiltro;
  }

  @Selector()
  static bandejaBuscar(state: BandejaStateModel) {
    return state.bandejaBuscar;
  }

  @Selector()
  static bandejaActiva(state: BandejaStateModel) {
    return state.bandejaActiva;
  }

  @Selector()
  static internos(state: BandejaStateModel) {
    return state.internos;
  }
  @Selector()
  static documentos(state: BandejaStateModel) {
    // return state.documentos;
    // return state.bandejas[state.bandejaActiva];
    return state.bandejas.getAtributes(state.bandejaActiva); //--- get
  }

  @Selector()
  static buzonActual(state: BandejaStateModel) {
    return state.buzonActual;
  }

  @Selector()
  static bandeja(state: BandejaStateModel) {
    return state;
  }

  @Selector()
  static currentUserBuzon(state: BandejaStateModel) {
    return state.listaBuzones[0];
  }

  @Selector()
  static listaBuzones(state: BandejaStateModel) {
    return state.listaBuzones;
  }

  @Selector()
  static counts(state: BandejaStateModel) {
    return {
      e: state.bandejas.e.length,
      a: state.bandejas.a.length,
      s: state.bandejas.s.length,
    };
  }

  @Selector()
  static pending(state: BandejaStateModel) {
    return state.pending;
  }

  @Selector()
  static loaded(state: BandejaStateModel) {
    return state.loaded;
  }

  @Receiver({ cancelUncompleted: true })
  public static loadDocuments(ctx: Context, action: FiltroAction) {
    const bandejaFiltro = action.payload;
    const buzonUsuario = ctx.getState().buzonActual;
    //verificar si hay algun buzon seleccionado
    if (buzonUsuario.permiso == 0) return of([]);
    ctx.patchState({ bandejaFiltro, pending: true });
    return this.api
      .getBandeja(buzonUsuario.loginUsuarioBuzon, bandejaFiltro)
      .pipe(
        tap((documentos) => {
          let bandejas = new Bandejas();
          bandejas.setAtributes(bandejaFiltro.bandeja, documentos.bandeja); //--- set
          // bandejas[bandejaFiltro.bandeja] = documentos.bandeja;
          ctx.patchState({
            bandejas: bandejas,
            bandejaActiva: bandejaFiltro.bandeja,
            internos: documentos.internos,
            loaded: true,
            pending: false,
          });
        }),
        catchError((_err) => {
          //ctx.patchState(defaultStateBandeja);
          return of([]);
        })
      );
  }

  @Receiver({ cancelUncompleted: true })
  public static loadListaBuzones(ctx: Context) {
    ctx.patchState({ pending: true });
    return this.api.buscarUsuarioBandeja().pipe(
      tap((buzones) => {
        ctx.patchState({
          listaBuzones: buzones,
          buzonActual: buzones[0],
          pending: false,
        });
      }),
      catchError((_err) => {
        return of([]);
      })
    );
  }

  @Receiver({ cancelUncompleted: true })
  public static searchDocuments(ctx: Context, action: BuscarAction) {
    const bandejaBuscar = action.payload;
    const loginUsuarioBuzon = ctx.getState().buzonActual.loginUsuarioBuzon;
    ctx.patchState({
      bandejaActiva: 'e',
      bandejas: new Bandejas(),
      bandejaBuscar,
      pending: true,
    });
    console.log('state', loginUsuarioBuzon, bandejaBuscar);
    return this.api.buscarBandeja(loginUsuarioBuzon, bandejaBuscar).pipe(
      tap((b) => {
        console.log('respuesta', b);
        const bandejaActiva =
          b.e.length > 0
            ? 'e'
            : b.a.length > 0
            ? 'a'
            : b.s.length > 0
            ? 's'
            : 'e';
        ctx.patchState({ bandejas: b, bandejaActiva, pending: false });
      }),
      catchError((_err) => {
        //ctx.patchState(defaultStateBandeja);
        return of([]);
      })
    );
  }
  @Receiver()
  public static setBandejaActiva(ctx: Context, action: BandejaActivaAction) {
    const bandejaActiva = action.payload;
    ctx.patchState({ bandejaActiva: bandejaActiva });
  }

  @Receiver()
  public static setBuzonActual(ctx: Context, action: BuzonUsuarioAction) {
    const buzonUsuario = action.payload;
    ctx.patchState({ buzonActual: buzonUsuario });
  }
}
