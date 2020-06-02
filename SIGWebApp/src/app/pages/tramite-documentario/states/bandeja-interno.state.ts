import { Injector } from '@angular/core';
import { State, StateContext, Selector } from '@ngxs/store';
import { Receiver, EmitterAction } from '@ngxs-labs/emitter';
import { tap, catchError } from 'rxjs/operators';

import { TramiteService } from '../tramite-documentario.service';

import { BandejaFiltro, BuscarBandeja } from '@models/tramite/bandeja-filtro';
import { of } from 'rxjs';
import { BandejasInternas } from '@models/tramite/bandejas';

export interface BandejaInternoStateModel {
  bandejaFiltro: BandejaFiltro;
  bandejaBuscar: BuscarBandeja;
  bandejas:BandejasInternas;
  bandejaActiva: string;
  loaded: boolean;
  pending: boolean;
}

type FiltroAction = EmitterAction<BandejaFiltro>;
type BuscarAction = EmitterAction<BuscarBandeja>;
type BandejaActivaAction = EmitterAction<string>;
type Context = StateContext<BandejaInternoStateModel>;

const defaultStateBandejaInterno = {
  bandejaFiltro: new BandejaFiltro(),
  bandejaBuscar: new BuscarBandeja(),
  bandejas:new BandejasInternas(),
  bandejaActiva:'e',
  loaded: false,
  pending: false
};

@State<BandejaInternoStateModel>({
  name: 'bandejaInterno',
  defaults: defaultStateBandejaInterno
})
export class BandejaInternoState {
  private static api: TramiteService;

  constructor(injector: Injector) {
    BandejaInternoState.api = injector.get<TramiteService>(TramiteService);
  }

  @Selector()
  static bandejaFiltro(state: BandejaInternoStateModel) {
    return state.bandejaFiltro;
  }

  @Selector()
  static bandejaBuscar(state: BandejaInternoStateModel) {
    return state.bandejaBuscar;
  }

  @Selector()
  static bandejaActiva(state: BandejaInternoStateModel) {
    return state.bandejaActiva;
  }

  @Selector()
  static documentos(state: BandejaInternoStateModel) {
    // return state.documentos;
    return state.bandejas[state.bandejaActiva];
  }

  @Selector()
  static counts(state: BandejaInternoStateModel) {
    return {
      e:state.bandejas.e.length,
      a:state.bandejas.a.length,
      s:state.bandejas.s.length,
    };
  }

  @Selector()
  static pending(state: BandejaInternoStateModel) {
    return state.pending;
  }

  @Selector()
  static loaded(state: BandejaInternoStateModel) {
    return state.loaded;
  }

  @Receiver({ cancelUncompleted: true })
  public static loadDocuments(ctx: Context, action: FiltroAction) {
    const bandejaFiltro = action.payload;
    ctx.patchState({ bandejaFiltro, pending: true });
    return this.api.getBandejaDocumentoInterno(bandejaFiltro).pipe(
      tap(documentos =>{
        let bandejas= new BandejasInternas();
        bandejas[bandejaFiltro.bandeja]=documentos;
        ctx.patchState({bandejas:bandejas,
                        bandejaActiva:bandejaFiltro.bandeja,
                        loaded: true,
                        pending: false })}
      ),
      catchError(_err => {
        //ctx.patchState(defaultStateBandeja);
        return of([]);
      })
    );
  }

  @Receiver({ cancelUncompleted: true })
  public static searchDocuments(ctx: Context, action: BuscarAction) {
    const bandejaBuscar = action.payload;
    ctx.patchState({bandejaActiva:'e',bandejas:new BandejasInternas(), bandejaBuscar, pending: true });
    return this.api.buscarBandejaInterna(bandejaBuscar).pipe(
      tap(
        b =>{
          const bandejaActiva=(b.e.length>0)?'e':
                              (b.a.length>0)?'a':
                              (b.s.length>0)?'s':'e'
          ctx.patchState({ bandejas:b, bandejaActiva, pending: false })
        }
      ),
      catchError(_err => {
        //ctx.patchState(defaultStateBandeja);
        return of([]);
      })
    );
  }
  @Receiver()
  public static setBandejaActiva(ctx: Context, action: BandejaActivaAction) {
    const bandejaActiva = action.payload;
    ctx.patchState({ bandejaActiva:bandejaActiva });
  }

}
