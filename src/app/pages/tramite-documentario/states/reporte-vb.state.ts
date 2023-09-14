import { Injector, Injectable } from '@angular/core';
import { State, StateContext, Selector } from '@ngxs/store';
import { Receiver, EmitterAction } from '@ngxs-labs/emitter';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { TramiteService } from '../tramite-documentario.service';
import { SeguimientoDocumento } from '../../../@models/tramite/seguimiento-documento';
import { SeguimientoFiltroVb } from '../../../@models/tramite/seguimiento-filtro-vb';

export interface ReporteVbStateModel {
  seguimientoFiltroVb: SeguimientoFiltroVb;
  documentos: SeguimientoDocumento[];
  loaded: boolean;
  pending: boolean;
}
type FiltroAction = EmitterAction<SeguimientoFiltroVb>;
type Context = StateContext<ReporteVbStateModel>;

const defaultStateReporteVb = {
  seguimientoFiltroVb: new SeguimientoFiltroVb(),
  documentos: [],
  loaded: false,
  pending: false,
};

@State<ReporteVbStateModel>({
  name: 'ReporteVb',
  defaults: defaultStateReporteVb,
})
@Injectable()
export class ReporteVbState {
  private static api: TramiteService;

  constructor(injector: Injector) {
    ReporteVbState.api = injector.get<TramiteService>(TramiteService);
  }

  @Selector()
  static seguimientoFiltroVb(state: ReporteVbStateModel) {
    return state.seguimientoFiltroVb;
  }

  @Selector()
  static documentos(state: ReporteVbStateModel) {
    return state.documentos;
  }

  @Selector()
  static pending(state: ReporteVbStateModel) {
    return state.pending;
  }
  @Selector()
  static loaded(state: ReporteVbStateModel) {
    return state.loaded;
  }

  @Receiver({ cancelUncompleted: true })
  public static loadDocuments(ctx: Context, action: FiltroAction) {
    const seguimientoFiltroVb = action.payload;
    ctx.patchState({ seguimientoFiltroVb, pending: true });
    console.log(JSON.stringify(seguimientoFiltroVb));
    return this.api.getBuscarVb(seguimientoFiltroVb).pipe(
      tap((documentos) =>
        ctx.patchState({ documentos, loaded: true, pending: false })
      ),
      catchError((_err) => {
        defaultStateReporteVb.seguimientoFiltroVb = seguimientoFiltroVb;
        ctx.patchState(defaultStateReporteVb);
        return of([]);
      })
    );
  }
}
