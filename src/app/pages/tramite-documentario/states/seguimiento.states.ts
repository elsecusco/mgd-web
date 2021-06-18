import { Injector } from '@angular/core';
import { State, StateContext, Selector } from '@ngxs/store';
import { Receiver, EmitterAction } from '@ngxs-labs/emitter';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { TramiteService } from '../tramite-documentario.service';
import { SeguimientoDocumento } from '@models/tramite/seguimiento-documento';
import { SeguimientoFiltro } from '@models/tramite/seguimiento-filtro';
import { SeguimientoFiltroVb } from '@models/tramite/seguimiento-filtro-vb';


export interface SeguimientoStateModel {
    seguimientoFiltro: SeguimientoFiltro;
    documentos: SeguimientoDocumento[];
    loaded: boolean;
    pending: boolean;
}
type FiltroAction = EmitterAction<SeguimientoFiltro>;
type Context = StateContext<SeguimientoStateModel>;

const defaultStateSeguimiento = {
    seguimientoFiltro: new SeguimientoFiltro(),
    documentos: [],
    loaded: false,
    pending: false
};

@State<SeguimientoStateModel>({
    name: 'seguimiento',
    defaults: defaultStateSeguimiento
})
export class SeguimientoState {
    private static api: TramiteService;

    constructor(injector: Injector) {
      SeguimientoState.api = injector.get<TramiteService>(TramiteService);
    }
    @Selector()
    static seguimientoFiltro(state: SeguimientoStateModel) {
    return state.seguimientoFiltro;
    }


    @Selector()
    static seguimientoDocumento(state: SeguimientoStateModel) {
    return state.seguimientoFiltro;
    }

    @Selector()
    static documentos(state: SeguimientoStateModel) {
        return state.documentos;
    }

    @Selector()
    static pending(state: SeguimientoStateModel) {
        return state.pending;
    }
    @Selector()
    static loaded(state: SeguimientoStateModel) {
        return state.loaded;
    }

    @Receiver({ cancelUncompleted: true })
    public static loadDocuments(ctx: Context, action: FiltroAction) {
        const seguimientoFiltro = action.payload;
        ctx.patchState({ seguimientoFiltro, pending: true });

        return this.api.getBuscar(seguimientoFiltro,).pipe(
        tap(documentos =>
            ctx.patchState({documentos, loaded: true, pending: false })
        ),
        catchError(_err => {
            defaultStateSeguimiento.seguimientoFiltro=seguimientoFiltro;
            ctx.patchState(defaultStateSeguimiento);
            return of([]);
        })
        );
    }

}
