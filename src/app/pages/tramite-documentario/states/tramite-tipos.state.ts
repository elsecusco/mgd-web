import { Injector } from '@angular/core';
import { State, StateContext, Selector } from '@ngxs/store';
import { Receiver } from '@ngxs-labs/emitter';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { TramiteService } from '../tramite-documentario.service';

import { TramiteTipos } from '@models/tramite/tramite-tipos';

export interface TramiteTiposStateModel {
  tipos: TramiteTipos;
  loaded: boolean;
  loading: boolean;
}

type Context = StateContext<TramiteTiposStateModel>;

const defaultStateTramiteTipos = {
  tipos: new TramiteTipos(),
  loaded: false,
  loading: false
};

@State<TramiteTiposStateModel>({
  name: 'tramiteTipos',
  defaults: defaultStateTramiteTipos
})
export class TramiteTiposState {
  private static api: TramiteService;

  constructor(injector: Injector) {
    TramiteTiposState.api = injector.get<TramiteService>(TramiteService);
  }

  @Selector()
  static tipos(state: TramiteTiposStateModel) {
    return state.tipos;
  }
  @Selector()
  static tiposPrioridad(state: TramiteTiposStateModel) {
    return state.tipos.tiposPrioridad;
  }
  @Selector()
  static loading(state: TramiteTiposStateModel) {
    return state.loading;
  }
  @Selector()
  static loaded(state: TramiteTiposStateModel) {
    return state.loaded;
  }

  @Receiver({ cancelUncompleted: true })
  public static loadTipos(ctx: Context) {
    ctx.patchState({ loading: true });

    return this.api.tiposTramite().pipe(
      tap(tipos => ctx.patchState({ tipos, loaded: true, loading: false })),
      catchError(_err => {
        ctx.patchState(defaultStateTramiteTipos);
        return of(new TramiteTipos());
      })
    );
  }
}
